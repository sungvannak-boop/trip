import { Edit3, Plus, ShieldAlert, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Category, Destination, Language, User } from '../types/tourism';
import { tourismApi } from '../utils/api';
import { getLocalizedText } from '../utils/tourismLogic';
import { resolveDestinationImage } from '../data/destinationImages';
import { TRANSLATIONS } from '../i18n/translations';
import { SafeImage } from './SafeImage';

interface AdminDashboardViewProps {
  language: Language;
  user: User | null;
  categories: Category[];
  destinations: Destination[];
  onRefreshData: () => Promise<void>;
  onLoginAdminDemo: () => Promise<void>;
}

export function AdminDashboardView({
  language,
  user,
  categories,
  destinations,
  onRefreshData,
  onLoginAdminDemo,
}: AdminDashboardViewProps) {
  const t = TRANSLATIONS[language];
  const [subTab, setSubTab] = useState<'destinations' | 'categories'>('destinations');
  const [stats, setStats] = useState<{
    destinations: number;
    categories: number;
    users: number;
    trips: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Destination editor modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameKm, setNameKm] = useState('');
  const [provinceEn, setProvinceEn] = useState('');
  const [provinceKm, setProvinceKm] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressKm, setAddressKm] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id ?? 1);
  const [latitude, setLatitude] = useState('13.4125');
  const [longitude, setLongitude] = useState('103.8670');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionKm, setDescriptionKm] = useState('');
  const [travelTipsEn, setTravelTipsEn] = useState('');
  const [travelTipsKm, setTravelTipsKm] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPopular, setIsPopular] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Category quick create state
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameKm, setCatNameKm] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catDescKm, setCatDescKm] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      tourismApi
        .adminGetStats()
        .then((res) => setStats(res.stats))
        .catch(() => {});
    }
  }, [user, destinations.length, categories.length]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-10 text-center max-w-xl mx-auto space-y-4">
        <ShieldAlert className="w-10 h-10 text-[#8A6305] mx-auto" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-[#17211C]">{t.admin.restrictedTitle}</h1>
        <p className="text-sm text-[#5A655F] leading-relaxed">{t.admin.restrictedBody}</p>
        <button
          type="button"
          onClick={onLoginAdminDemo}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors"
        >
          {t.profile.demoAdminBtn}
        </button>
      </div>
    );
  }

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const openCreateDest = () => {
    setEditingDest(null);
    setNameEn('');
    setNameKm('');
    setProvinceEn('');
    setProvinceKm('');
    setAddressEn('');
    setAddressKm('');
    setCategoryId(categories[0]?.id ?? 1);
    setLatitude('11.5564');
    setLongitude('104.9282');
    setDescriptionEn('');
    setDescriptionKm('');
    setTravelTipsEn('');
    setTravelTipsKm('');
    setImageUrl('');
    setIsPopular(true);
    setIsFeatured(false);
    setErrorMsg(null);
    setEditorOpen(true);
  };

  const openEditDest = (dest: Destination) => {
    setEditingDest(dest);
    setNameEn(dest.nameEn);
    setNameKm(dest.nameKm);
    setProvinceEn(dest.provinceEn);
    setProvinceKm(dest.provinceKm);
    setAddressEn(dest.addressEn);
    setAddressKm(dest.addressKm);
    setCategoryId(dest.categoryId);
    setLatitude(String(dest.latitude));
    setLongitude(String(dest.longitude));
    setDescriptionEn(dest.descriptionEn);
    setDescriptionKm(dest.descriptionKm);
    setTravelTipsEn(dest.travelTipsEn);
    setTravelTipsKm(dest.travelTipsKm);
    setImageUrl(dest.imageUrl ?? '');
    setIsPopular(dest.isPopular);
    setIsFeatured(dest.isFeatured);
    setErrorMsg(null);
    setEditorOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      });
      const res = await tourismApi.adminUploadImage(file.name, dataUrl);
      setImageUrl(res.imageUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const payload: Partial<Destination> = {
        nameEn,
        nameKm,
        provinceEn,
        provinceKm: provinceKm || provinceEn,
        addressEn: addressEn || provinceEn,
        addressKm: addressKm || provinceKm || provinceEn,
        categoryId,
        latitude: Number(latitude),
        longitude: Number(longitude),
        descriptionEn,
        descriptionKm,
        travelTipsEn,
        travelTipsKm,
        imageUrl: imageUrl || undefined,
        isPopular,
        isFeatured,
      };
      if (editingDest) {
        await tourismApi.adminUpdateDestination(editingDest.id, payload);
      } else {
        await tourismApi.adminCreateDestination(payload);
      }
      await onRefreshData();
      setEditorOpen(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save destination.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDestination = async (id: number) => {
    setErrorMsg(null);
    try {
      await tourismApi.adminDeleteDestination(id);
      await onRefreshData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete destination.');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await tourismApi.adminCreateCategory({
        nameEn: catNameEn,
        nameKm: catNameKm,
        descriptionEn: catDescEn,
        descriptionKm: catDescKm,
        icon: 'compass',
      });
      setCatNameEn('');
      setCatNameKm('');
      setCatDescEn('');
      setCatDescKm('');
      await onRefreshData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    setErrorMsg(null);
    try {
      await tourismApi.adminDeleteCategory(id);
      await onRefreshData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Cannot delete category.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#17211C]">{t.admin.title}</h1>
          <p className="text-sm text-[#5A655F] mt-1">{t.admin.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={openCreateDest}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D5C46] text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-[#0A4A38] self-start whitespace-nowrap"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{t.admin.addDestinationBtn}</span>
        </button>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-5">
          <div className="text-xs text-[#5A655F]">{t.admin.totalDestinations}</div>
          <div className="text-3xl font-bold text-[#17211C] mt-1 tabular-nums">
            {stats?.destinations ?? destinations.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-5">
          <div className="text-xs text-[#5A655F]">{t.admin.totalCategories}</div>
          <div className="text-3xl font-bold text-[#17211C] mt-1 tabular-nums">
            {stats?.categories ?? categories.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-5">
          <div className="text-xs text-[#5A655F]">{t.admin.totalUsers}</div>
          <div className="text-3xl font-bold text-[#17211C] mt-1 tabular-nums">
            {stats?.users ?? 2}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-5">
          <div className="text-xs text-[#5A655F]">{t.admin.totalTrips}</div>
          <div className="text-3xl font-bold text-[#17211C] mt-1 tabular-nums">
            {stats?.trips ?? 1}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-[#991B1B]"
        >
          {errorMsg}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="inline-flex items-center p-1 rounded-xl bg-[#EFECE6] border border-[#E5E0D8]">
        <button
          type="button"
          onClick={() => setSubTab('destinations')}
          className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            subTab === 'destinations' ? 'bg-white text-[#17211C]' : 'text-[#5A655F]'
          }`}
        >
          {t.admin.destinationsTab}
        </button>
        <button
          type="button"
          onClick={() => setSubTab('categories')}
          className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            subTab === 'categories' ? 'bg-white text-[#17211C]' : 'text-[#5A655F]'
          }`}
        >
          {t.admin.categoriesTab}
        </button>
      </div>

      {subTab === 'destinations' ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EFECE6] text-xs text-[#5A655F]">
                <th className="py-3.5 px-4 font-semibold">Destination</th>
                <th className="py-3.5 px-4 font-semibold">Province</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Coordinates</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4] text-sm">
              {destinations.map((dest) => {
                const cat = categoryById.get(dest.categoryId);
                return (
                  <tr key={dest.id} className="hover:bg-[#FAF8F4]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-[#EFECE6] shrink-0">
                          <SafeImage
                            src={resolveDestinationImage(dest.imageKey, dest.imageUrl)}
                            alt={dest.nameEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#17211C]">{dest.nameEn}</div>
                          <div className="text-xs text-[#6B7570] khmer-text">{dest.nameKm}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#4B5650]">
                      {getLocalizedText(dest.provinceEn, dest.provinceKm, language)}
                    </td>
                    <td className="py-3 px-4 text-[#4B5650]">
                      {cat ? getLocalizedText(cat.nameEn, cat.nameKm, language) : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#5A655F] tabular-nums">
                      {dest.latitude.toFixed(4)}, {dest.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditDest(dest)}
                          aria-label={`Edit ${dest.nameEn}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#E5E0D8] text-xs font-medium text-[#17211C] hover:bg-[#EFECE6] inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t.admin.editDestination}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDestination(dest.id)}
                          aria-label={`Delete ${dest.nameEn}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#FECACA] text-xs font-medium text-[#B91C1C] hover:bg-[#FEF2F2] inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t.admin.deleteDestination}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E0D8] divide-y divide-[#F0ECE4]">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-[#17211C]">
                    {cat.nameEn} · <span className="khmer-text">{cat.nameKm}</span>
                  </div>
                  <div className="text-xs text-[#5A655F] mt-0.5">{cat.descriptionEn}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  aria-label={`Delete category ${cat.nameEn}`}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#FECACA] text-xs font-medium text-[#B91C1C] hover:bg-[#FEF2F2] shrink-0"
                >
                  {t.admin.deleteDestination}
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleCreateCategory}
            className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E0D8] p-5 space-y-4 self-start"
          >
            <h2 className="text-lg font-semibold text-[#17211C]">{t.admin.addCategoryBtn}</h2>
            <div>
              <label htmlFor="cat-en" className="block text-xs font-semibold mb-1">
                Category name (English)
              </label>
              <input
                id="cat-en"
                type="text"
                required
                value={catNameEn}
                onChange={(e) => setCatNameEn(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8D2C5] text-sm"
              />
            </div>
            <div>
              <label htmlFor="cat-km" className="block text-xs font-semibold mb-1">
                Category name (Khmer)
              </label>
              <input
                id="cat-km"
                type="text"
                required
                value={catNameKm}
                onChange={(e) => setCatNameKm(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8D2C5] text-sm khmer-text"
              />
            </div>
            <div>
              <label htmlFor="cat-desc" className="block text-xs font-semibold mb-1">
                Description (English)
              </label>
              <input
                id="cat-desc"
                type="text"
                value={catDescEn}
                onChange={(e) => setCatDescEn(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8D2C5] text-sm"
              />
            </div>
            <div>
              <label htmlFor="cat-desc-km" className="block text-xs font-semibold mb-1">
                Description (Khmer)
              </label>
              <input
                id="cat-desc-km"
                type="text"
                value={catDescKm}
                onChange={(e) => setCatDescKm(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8D2C5] text-sm khmer-text"
              />
            </div>
            <button
              type="submit"
              className="min-h-[44px] w-full rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38]"
            >
              {t.admin.addCategoryBtn}
            </button>
          </form>
        </div>
      )}

      {/* Destination Create / Edit Modal */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-dest-modal"
        >
          <div className="bg-white rounded-3xl border border-[#E5E0D8] w-full max-w-3xl max-h-[92dvh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFECE6]">
              <h2 id="admin-dest-modal" className="text-xl font-bold text-[#17211C]">
                {editingDest ? `${t.admin.editDestination}: ${editingDest.nameEn}` : t.admin.addDestinationBtn}
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                aria-label={t.common.close}
                className="min-w-[40px] min-h-[40px] rounded-xl border border-[#E5E0D8] flex items-center justify-center"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dest-en" className="block text-xs font-semibold mb-1">
                    Name (English)
                  </label>
                  <input
                    id="dest-en"
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8D2C5] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="dest-km" className="block text-xs font-semibold mb-1">
                    Name (Khmer)
                  </label>
                  <input
                    id="dest-km"
                    type="text"
                    required
                    value={nameKm}
                    onChange={(e) => setNameKm(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8D2C5] text-sm khmer-text"
                  />
                </div>
                <div>
                  <label htmlFor="dest-prov-en" className="block text-xs font-semibold mb-1">
                    Province (English)
                  </label>
                  <input
                    id="dest-prov-en"
                    type="text"
                    required
                    value={provinceEn}
                    onChange={(e) => setProvinceEn(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8D2C5] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="dest-prov-km" className="block text-xs font-semibold mb-1">
                    Province (Khmer)
                  </label>
                  <input
                    id="dest-prov-km"
                    type="text"
                    value={provinceKm}
                    onChange={(e) => setProvinceKm(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8D2C5] text-sm khmer-text"
                  />
                </div>
                <div>
                  <label htmlFor="dest-cat" className="block text-xs font-semibold mb-1">
                    Category
                  </label>
                  <select
                    id="dest-cat"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8D2C5] text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="dest-lat" className="block text-xs font-semibold mb-1">
                      Latitude
                    </label>
                    <input
                      id="dest-lat"
                      type="number"
                      step="any"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8D2C5] text-sm font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label htmlFor="dest-lng" className="block text-xs font-semibold mb-1">
                      Longitude
                    </label>
                    <input
                      id="dest-lng"
                      type="number"
                      step="any"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8D2C5] text-sm font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dest-desc-en" className="block text-xs font-semibold mb-1">
                    Description (English)
                  </label>
                  <textarea
                    id="dest-desc-en"
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D8D2C5] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="dest-desc-km" className="block text-xs font-semibold mb-1">
                    Description (Khmer)
                  </label>
                  <textarea
                    id="dest-desc-km"
                    rows={3}
                    value={descriptionKm}
                    onChange={(e) => setDescriptionKm(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D8D2C5] text-sm khmer-text"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E0D8] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#17211C]">{t.admin.uploadImageLabel}</div>
                  <div className="text-xs text-[#5A655F] mt-0.5">
                    {imageUrl ? `Uploaded: ${imageUrl}` : 'Optional: upload a custom JPG/PNG photo'}
                  </div>
                </div>
                <label className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-[#D8D2C5] text-xs font-medium text-[#17211C] inline-flex items-center gap-2 cursor-pointer hover:bg-[#EFECE6]">
                  <Upload className="w-4 h-4 text-[#0D5C46]" aria-hidden="true" />
                  <span>{uploading ? t.common.loading : t.admin.uploadImageLabel}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="accent-[#0D5C46] w-4 h-4"
                  />
                  <span>{t.common.popularLabel}</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#0D5C46] w-4 h-4"
                  />
                  <span>{t.common.featuredLabel}</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D8D2C5] text-sm font-medium"
                >
                  {t.trips.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38]"
                >
                  {t.admin.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
