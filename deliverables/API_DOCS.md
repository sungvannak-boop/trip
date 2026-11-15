# Cambodia Tourism Guide — REST API Documentation

Base URL: `https://<host>/api`  
Content-Type: `application/json`  
Authentication: Laravel Sanctum Bearer Token (`Authorization: Bearer <token>`)

---

## 1. Authentication & Profile

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register a tourist account (`name`, `email`, `password`, `preferred_language`) |
| `POST` | `/auth/login` | Public | Authenticate user and issue Sanctum personal access token |
| `POST` | `/auth/logout` | Bearer | Revoke current access token |
| `GET` | `/auth/user` | Bearer | Retrieve authenticated user profile |
| `PUT` | `/auth/profile` | Bearer | Update `name`, `email`, and `preferred_language` (`en` \| `km`) |
| `PUT` | `/auth/password` | Bearer | Change password (`current_password`, `new_password`) |

### Sample Login Response (`200 OK`)
```json
{
  "user": {
    "id": 1,
    "name": "Sokha Dara",
    "email": "tourist@cambodia.guide",
    "role": "tourist",
    "preferred_language": "en"
  },
  "token": "1|xK9mN..."
}
```

---

## 2. Categories & Destinations

| Method | Endpoint | Auth | Query Params / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Public | Returns all 7 bilingual tourism categories |
| `GET` | `/destinations` | Public | `?search=...&category=slug&province=...&popular=true&featured=true` |
| `GET` | `/destinations/{id}` | Public | Full destination details in Khmer & English + GPS + verification notices |

---

## 3. Favorites

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/favorites` | Bearer | List authenticated user's saved favorite destinations |
| `POST` | `/favorites` | Bearer | Body: `{ "destination_id": 1 }` — Save destination to favorites |
| `DELETE` | `/favorites/{destinationId}` | Bearer | Remove destination from user's favorites |

---

## 4. Travel Planner (Trips)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/trips` | Bearer | List user's travel plans with ordered destination stops |
| `POST` | `/trips` | Bearer | Create trip (`title`, `start_date`, `end_date`, `notes`, `destinations[]`) |
| `PUT` | `/trips/{id}` | Bearer | Update existing trip owned by authenticated user |
| `DELETE` | `/trips/{id}` | Bearer | Delete trip owned by authenticated user |

### Sample Create Trip Payload
```json
{
  "title": "Angkor & Kampot Heritage Loop",
  "start_date": "2026-12-10",
  "end_date": "2026-12-14",
  "notes": "Sunrise at Angkor Wat, then south to Kampot River.",
  "destinations": [1, 2, 10, 8]
}
```

---

## 5. Admin Management (`role = admin`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | Admin | Aggregate counts for destinations, categories, users, trips |
| `POST` | `/admin/upload` | Admin | Multipart `image` upload (`jpg/png/webp`, max 5MB) |
| `POST` | `/admin/destinations` | Admin | Create new bilingual destination |
| `PUT` | `/admin/destinations/{id}` | Admin | Update destination fields |
| `DELETE` | `/admin/destinations/{id}` | Admin | Delete destination |
| `POST` | `/admin/categories` | Admin | Create tourism category |
| `DELETE` | `/admin/categories/{id}` | Admin | Delete empty tourism category |

---

## 6. Error Responses
- `401 Unauthenticated`: Missing or invalid Sanctum Bearer token.
- `403 Forbidden`: User lacks `admin` role for protected CMS endpoints.
- `404 Not Found`: Resource ID or slug does not exist.
- `422 Unprocessable Entity`: Form Request validation failed (`errors` map returned).
