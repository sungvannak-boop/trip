import express, { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import {
  generateToken,
  hashPassword,
  loadDatabase,
  saveDatabase,
  StoredUser,
  UPLOADS_DIR,
  verifyPassword,
} from './server/db';
import { filterDestinations, validateTripInput } from './src/utils/tourismLogic';
import type { Category, Destination, Trip, User } from './src/types/tourism';

interface AuthenticatedRequest extends Request {
  authUser?: StoredUser;
  authToken?: string;
}

function sanitizeUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    createdAt: user.createdAt,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listDeliverableFiles(rootDir: string, prefix = ''): Array<{ path: string; size: number }> {
  if (!fs.existsSync(rootDir)) return [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const results: Array<{ path: string; size: number }> = [];
  for (const entry of entries) {
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listDeliverableFiles(fullPath, relPath));
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath);
      results.push({ path: relPath, size: stat.size });
    }
  }
  return results.sort((a, b) => a.path.localeCompare(b.path));
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Auth middleware (Sanctum-compatible Bearer token)
  const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthenticated. Please provide a Bearer token.' });
      return;
    }
    const token = header.slice('Bearer '.length).trim();
    const db = loadDatabase();
    const tokenRecord = db.tokens.find((t) => t.token === token);
    if (!tokenRecord) {
      res.status(401).json({ message: 'Invalid or expired authentication token.' });
      return;
    }
    const user = db.users.find((u) => u.id === tokenRecord.userId);
    if (!user) {
      res.status(401).json({ message: 'Authenticated user account not found.' });
      return;
    }
    req.authUser = user;
    req.authToken = token;
    next();
  };

  const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.authUser || req.authUser.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden. Administrator privileges required.' });
      return;
    }
    next();
  };

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'cambodia-tourism-api' });
  });

  // Auth endpoints
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, preferredLanguage } = req.body ?? {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(422).json({ message: 'Name must be at least 2 characters.' });
      return;
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(422).json({ message: 'A valid email address is required.' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(422).json({ message: 'Password must be at least 6 characters.' });
      return;
    }

    const db = loadDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      res.status(422).json({ message: 'An account with this email already exists.' });
      return;
    }

    const now = new Date().toISOString();
    const newUser: StoredUser = {
      id: db.nextIds.user++,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: 'tourist',
      preferredLanguage: preferredLanguage === 'km' ? 'km' : 'en',
      createdAt: now,
    };
    const token = generateToken();
    db.users.push(newUser);
    db.tokens.push({ token, userId: newUser.id, createdAt: now });
    saveDatabase(db);

    res.status(201).json({
      user: sanitizeUser(newUser),
      token,
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(422).json({ message: 'Email and password are required.' });
      return;
    }

    const db = loadDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken();
    db.tokens.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    saveDatabase(db);

    res.json({
      user: sanitizeUser(user),
      token,
    });
  });

  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
    const db = loadDatabase();
    db.tokens = db.tokens.filter((t) => t.token !== req.authToken);
    saveDatabase(db);
    res.json({ message: 'Logged out successfully.' });
  });

  app.get('/api/auth/user', requireAuth, (req: AuthenticatedRequest, res) => {
    res.json({ user: sanitizeUser(req.authUser!) });
  });

  app.put('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res) => {
    const { name, email, preferredLanguage } = req.body ?? {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(422).json({ message: 'Name must be at least 2 characters.' });
      return;
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(422).json({ message: 'Valid email is required.' });
      return;
    }

    const db = loadDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const conflict = db.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.id !== req.authUser!.id
    );
    if (conflict) {
      res.status(422).json({ message: 'Email is already in use by another account.' });
      return;
    }

    const target = db.users.find((u) => u.id === req.authUser!.id)!;
    target.name = name.trim();
    target.email = normalizedEmail;
    if (preferredLanguage === 'km' || preferredLanguage === 'en') {
      target.preferredLanguage = preferredLanguage;
    }
    saveDatabase(db);

    res.json({ user: sanitizeUser(target) });
  });

  app.put('/api/auth/password', requireAuth, (req: AuthenticatedRequest, res) => {
    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      res.status(422).json({ message: 'New password must be at least 6 characters.' });
      return;
    }

    const db = loadDatabase();
    const target = db.users.find((u) => u.id === req.authUser!.id)!;
    if (!verifyPassword(String(currentPassword), target.passwordHash)) {
      res.status(422).json({ message: 'Current password is incorrect.' });
      return;
    }

    target.passwordHash = hashPassword(newPassword);
    saveDatabase(db);
    res.json({ message: 'Password updated successfully.' });
  });

  // Categories
  app.get('/api/categories', (_req, res) => {
    const db = loadDatabase();
    res.json({ categories: db.categories });
  });

  // Destinations (search & filter)
  app.get('/api/destinations', (req, res) => {
    const db = loadDatabase();
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const province = typeof req.query.province === 'string' ? req.query.province : undefined;
    const popular = req.query.popular === 'true' || req.query.popular === '1';

    let items = filterDestinations(db.destinations, db.categories, {
      search,
      categorySlug: category,
      province,
      onlyPopular: popular,
    });

    if (req.query.featured === 'true' || req.query.featured === '1') {
      items = items.filter((d) => d.isFeatured);
    }

    res.json({ destinations: items });
  });

  app.get('/api/destinations/:id', (req, res) => {
    const db = loadDatabase();
    const idParam = req.params.id;
    const dest = db.destinations.find(
      (d) => String(d.id) === idParam || d.slug === idParam
    );
    if (!dest) {
      res.status(404).json({ message: 'Destination not found.' });
      return;
    }
    res.json({ destination: dest });
  });

  // Favorites
  app.get('/api/favorites', requireAuth, (req: AuthenticatedRequest, res) => {
    const db = loadDatabase();
    const favIds = db.favorites
      .filter((f) => f.userId === req.authUser!.id)
      .map((f) => f.destinationId);
    const destinations = db.destinations.filter((d) => favIds.includes(d.id));
    res.json({ favoriteIds: favIds, destinations });
  });

  app.post('/api/favorites', requireAuth, (req: AuthenticatedRequest, res) => {
    const destinationId = Number(req.body?.destinationId);
    if (!Number.isFinite(destinationId)) {
      res.status(422).json({ message: 'Valid destinationId is required.' });
      return;
    }

    const db = loadDatabase();
    const destExists = db.destinations.some((d) => d.id === destinationId);
    if (!destExists) {
      res.status(404).json({ message: 'Destination not found.' });
      return;
    }

    const existing = db.favorites.find(
      (f) => f.userId === req.authUser!.id && f.destinationId === destinationId
    );
    if (!existing) {
      db.favorites.push({
        id: db.nextIds.favorite++,
        userId: req.authUser!.id,
        destinationId,
        createdAt: new Date().toISOString(),
      });
      saveDatabase(db);
    }

    const favoriteIds = db.favorites
      .filter((f) => f.userId === req.authUser!.id)
      .map((f) => f.destinationId);
    res.status(201).json({ favoriteIds });
  });

  app.delete('/api/favorites/:destinationId', requireAuth, (req: AuthenticatedRequest, res) => {
    const destinationId = Number(req.params.destinationId);
    const db = loadDatabase();
    db.favorites = db.favorites.filter(
      (f) => !(f.userId === req.authUser!.id && f.destinationId === destinationId)
    );
    saveDatabase(db);

    const favoriteIds = db.favorites
      .filter((f) => f.userId === req.authUser!.id)
      .map((f) => f.destinationId);
    res.json({ favoriteIds });
  });

  // Trips
  app.get('/api/trips', requireAuth, (req: AuthenticatedRequest, res) => {
    const db = loadDatabase();
    const trips = db.trips
      .filter((t) => t.userId === req.authUser!.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ trips });
  });

  app.post('/api/trips', requireAuth, (req: AuthenticatedRequest, res) => {
    const { title, startDate, endDate, notes, destinations } = req.body ?? {};
    const destIds = Array.isArray(destinations)
      ? destinations.map((d: { destinationId?: number } | number) =>
          typeof d === 'number' ? d : Number(d?.destinationId)
        )
      : [];

    const check = validateTripInput({
      title: String(title ?? ''),
      startDate: String(startDate ?? ''),
      endDate: String(endDate ?? ''),
      destinationIds: destIds,
    });

    if (!check.valid) {
      res.status(422).json({ message: `Trip validation failed: ${check.errorKey}` });
      return;
    }

    const db = loadDatabase();
    const now = new Date().toISOString();
    const newTrip: Trip = {
      id: db.nextIds.trip++,
      userId: req.authUser!.id,
      title: String(title).trim(),
      startDate: String(startDate),
      endDate: String(endDate),
      notes: String(notes ?? '').trim(),
      destinations: destIds.map((id, idx) => ({
        destinationId: id,
        visitOrder: idx + 1,
        dayNumber: 1,
      })),
      createdAt: now,
      updatedAt: now,
    };

    db.trips.push(newTrip);
    saveDatabase(db);
    res.status(201).json({ trip: newTrip });
  });

  app.put('/api/trips/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    const tripId = Number(req.params.id);
    const { title, startDate, endDate, notes, destinations } = req.body ?? {};
    const destIds = Array.isArray(destinations)
      ? destinations.map((d: { destinationId?: number } | number) =>
          typeof d === 'number' ? d : Number(d?.destinationId)
        )
      : [];

    const check = validateTripInput({
      title: String(title ?? ''),
      startDate: String(startDate ?? ''),
      endDate: String(endDate ?? ''),
      destinationIds: destIds,
    });

    if (!check.valid) {
      res.status(422).json({ message: `Trip validation failed: ${check.errorKey}` });
      return;
    }

    const db = loadDatabase();
    const trip = db.trips.find((t) => t.id === tripId && t.userId === req.authUser!.id);
    if (!trip) {
      res.status(404).json({ message: 'Trip not found.' });
      return;
    }

    trip.title = String(title).trim();
    trip.startDate = String(startDate);
    trip.endDate = String(endDate);
    trip.notes = String(notes ?? '').trim();
    trip.destinations = destIds.map((id, idx) => ({
      destinationId: id,
      visitOrder: idx + 1,
      dayNumber: 1,
    }));
    trip.updatedAt = new Date().toISOString();
    saveDatabase(db);

    res.json({ trip });
  });

  app.delete('/api/trips/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    const tripId = Number(req.params.id);
    const db = loadDatabase();
    const exists = db.trips.some((t) => t.id === tripId && t.userId === req.authUser!.id);
    if (!exists) {
      res.status(404).json({ message: 'Trip not found.' });
      return;
    }
    db.trips = db.trips.filter((t) => !(t.id === tripId && t.userId === req.authUser!.id));
    saveDatabase(db);
    res.json({ message: 'Trip deleted.' });
  });

  // Admin endpoints
  app.get('/api/admin/stats', requireAuth, requireAdmin, (_req, res) => {
    const db = loadDatabase();
    res.json({
      stats: {
        destinations: db.destinations.length,
        categories: db.categories.length,
        users: db.users.length,
        trips: db.trips.length,
        favorites: db.favorites.length,
      },
    });
  });

  app.post('/api/admin/upload', requireAuth, requireAdmin, (req, res) => {
    const { filename, dataUrl } = req.body ?? {};
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      res.status(422).json({ message: 'Valid base64 image dataUrl is required.' });
      return;
    }
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
    if (!match) {
      res.status(422).json({ message: 'Unsupported image format. Use PNG, JPEG, or WebP.' });
      return;
    }
    const ext = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
    const baseName = slugify(String(filename ?? 'destination').replace(/\.[^.]+$/, '')) || 'upload';
    const outName = `${baseName}-${Date.now()}.${ext}`;
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOADS_DIR, outName), Buffer.from(match[2], 'base64'));
    res.status(201).json({ imageUrl: `/uploads/${outName}` });
  });

  app.post('/api/admin/destinations', requireAuth, requireAdmin, (req, res) => {
    const payload = req.body ?? {};
    if (!payload.nameEn || !payload.nameKm || !payload.provinceEn || !payload.categoryId) {
      res.status(422).json({ message: 'English name, Khmer name, province, and category are required.' });
      return;
    }

    const lat = Number(payload.latitude);
    const lng = Number(payload.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      res.status(422).json({ message: 'Valid latitude and longitude coordinates are required.' });
      return;
    }

    const db = loadDatabase();
    const id = db.nextIds.destination++;
    const newDest: Destination = {
      id,
      categoryId: Number(payload.categoryId),
      slug: `${slugify(String(payload.nameEn))}-${id}`,
      nameEn: String(payload.nameEn).trim(),
      nameKm: String(payload.nameKm).trim(),
      descriptionEn: String(payload.descriptionEn ?? '').trim(),
      descriptionKm: String(payload.descriptionKm ?? '').trim(),
      provinceEn: String(payload.provinceEn).trim(),
      provinceKm: String(payload.provinceKm ?? payload.provinceEn).trim(),
      addressEn: String(payload.addressEn ?? payload.provinceEn).trim(),
      addressKm: String(payload.addressKm ?? payload.provinceKm ?? payload.provinceEn).trim(),
      latitude: lat,
      longitude: lng,
      entranceFeeNoteEn: String(
        payload.entranceFeeNoteEn ?? 'Requires verification: Confirm official entrance fee on arrival.'
      ),
      entranceFeeNoteKm: String(
        payload.entranceFeeNoteKm ?? 'ត្រូវផ្ទៀងផ្ទាត់៖ សូមបញ្ជាក់តម្លៃសំបុត្រនៅទីតាំងផ្ទាល់។'
      ),
      openingHoursNoteEn: String(
        payload.openingHoursNoteEn ?? 'Requires verification: Confirm local opening hours before travel.'
      ),
      openingHoursNoteKm: String(
        payload.openingHoursNoteKm ?? 'ត្រូវផ្ទៀងផ្ទាត់៖ សូមផ្ទៀងផ្ទាត់ម៉ោងបើកទស្សនាជាក់ស្តែង។'
      ),
      travelTipsEn: String(payload.travelTipsEn ?? 'Bring water and respect local heritage guidelines.'),
      travelTipsKm: String(payload.travelTipsKm ?? 'សូមយកទឹកផឹកតាមខ្លួន និងគោរពបទបញ្ជានៅទីតាំង។'),
      imageKey: String(payload.imageKey ?? 'angkor_wat'),
      imageUrl: payload.imageUrl ? String(payload.imageUrl) : undefined,
      isPopular: Boolean(payload.isPopular),
      isFeatured: Boolean(payload.isFeatured),
      isRecommended: Boolean(payload.isRecommended),
      requiresVerification: true,
      createdAt: new Date().toISOString(),
    };

    db.destinations.push(newDest);
    saveDatabase(db);
    res.status(201).json({ destination: newDest });
  });

  app.put('/api/admin/destinations/:id', requireAuth, requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const payload = req.body ?? {};
    const db = loadDatabase();
    const idx = db.destinations.findIndex((d) => d.id === id);
    if (idx === -1) {
      res.status(404).json({ message: 'Destination not found.' });
      return;
    }

    const current = db.destinations[idx];
    const updated: Destination = {
      ...current,
      categoryId: payload.categoryId !== undefined ? Number(payload.categoryId) : current.categoryId,
      nameEn: payload.nameEn !== undefined ? String(payload.nameEn).trim() : current.nameEn,
      nameKm: payload.nameKm !== undefined ? String(payload.nameKm).trim() : current.nameKm,
      descriptionEn: payload.descriptionEn !== undefined ? String(payload.descriptionEn) : current.descriptionEn,
      descriptionKm: payload.descriptionKm !== undefined ? String(payload.descriptionKm) : current.descriptionKm,
      provinceEn: payload.provinceEn !== undefined ? String(payload.provinceEn).trim() : current.provinceEn,
      provinceKm: payload.provinceKm !== undefined ? String(payload.provinceKm).trim() : current.provinceKm,
      addressEn: payload.addressEn !== undefined ? String(payload.addressEn) : current.addressEn,
      addressKm: payload.addressKm !== undefined ? String(payload.addressKm) : current.addressKm,
      latitude: payload.latitude !== undefined ? Number(payload.latitude) : current.latitude,
      longitude: payload.longitude !== undefined ? Number(payload.longitude) : current.longitude,
      entranceFeeNoteEn:
        payload.entranceFeeNoteEn !== undefined ? String(payload.entranceFeeNoteEn) : current.entranceFeeNoteEn,
      entranceFeeNoteKm:
        payload.entranceFeeNoteKm !== undefined ? String(payload.entranceFeeNoteKm) : current.entranceFeeNoteKm,
      openingHoursNoteEn:
        payload.openingHoursNoteEn !== undefined ? String(payload.openingHoursNoteEn) : current.openingHoursNoteEn,
      openingHoursNoteKm:
        payload.openingHoursNoteKm !== undefined ? String(payload.openingHoursNoteKm) : current.openingHoursNoteKm,
      travelTipsEn: payload.travelTipsEn !== undefined ? String(payload.travelTipsEn) : current.travelTipsEn,
      travelTipsKm: payload.travelTipsKm !== undefined ? String(payload.travelTipsKm) : current.travelTipsKm,
      imageUrl: payload.imageUrl !== undefined ? String(payload.imageUrl) || undefined : current.imageUrl,
      isPopular: payload.isPopular !== undefined ? Boolean(payload.isPopular) : current.isPopular,
      isFeatured: payload.isFeatured !== undefined ? Boolean(payload.isFeatured) : current.isFeatured,
      isRecommended: payload.isRecommended !== undefined ? Boolean(payload.isRecommended) : current.isRecommended,
    };

    db.destinations[idx] = updated;
    saveDatabase(db);
    res.json({ destination: updated });
  });

  app.delete('/api/admin/destinations/:id', requireAuth, requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const db = loadDatabase();
    if (!db.destinations.some((d) => d.id === id)) {
      res.status(404).json({ message: 'Destination not found.' });
      return;
    }
    db.destinations = db.destinations.filter((d) => d.id !== id);
    db.favorites = db.favorites.filter((f) => f.destinationId !== id);
    saveDatabase(db);
    res.json({ message: 'Destination deleted.' });
  });

  app.post('/api/admin/categories', requireAuth, requireAdmin, (req, res) => {
    const { nameEn, nameKm, descriptionEn, descriptionKm, icon } = req.body ?? {};
    if (!nameEn || !nameKm) {
      res.status(422).json({ message: 'Both English and Khmer category names are required.' });
      return;
    }
    const db = loadDatabase();
    const id = db.nextIds.category++;
    const category: Category = {
      id,
      slug: `${slugify(String(nameEn))}-${id}`,
      nameEn: String(nameEn).trim(),
      nameKm: String(nameKm).trim(),
      icon: String(icon ?? 'compass'),
      descriptionEn: String(descriptionEn ?? '').trim(),
      descriptionKm: String(descriptionKm ?? '').trim(),
    };
    db.categories.push(category);
    saveDatabase(db);
    res.status(201).json({ category });
  });

  app.delete('/api/admin/categories/:id', requireAuth, requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const db = loadDatabase();
    if (db.destinations.some((d) => d.categoryId === id)) {
      res.status(422).json({ message: 'Cannot delete a category that still contains destinations.' });
      return;
    }
    db.categories = db.categories.filter((c) => c.id !== id);
    saveDatabase(db);
    res.json({ message: 'Category deleted.' });
  });

  // Deliverables browser API
  const deliverablesRoot = path.resolve(process.cwd(), 'deliverables');
  app.get('/api/deliverables', (_req, res) => {
    const files = listDeliverableFiles(deliverablesRoot);
    res.json({ files });
  });

  app.get('/api/deliverables/file', (req, res) => {
    const rel = typeof req.query.path === 'string' ? req.query.path : '';
    const resolved = path.resolve(deliverablesRoot, rel);
    if (!resolved.startsWith(deliverablesRoot + path.sep) || !fs.existsSync(resolved)) {
      res.status(404).json({ message: 'Deliverable file not found.' });
      return;
    }
    const content = fs.readFileSync(resolved, 'utf-8');
    res.json({ path: rel, content });
  });

  // Vite dev / static production serving
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cambodia Tourism Guide server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
