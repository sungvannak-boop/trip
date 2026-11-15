import { Calendar, Edit3, MapPin, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Destination, Language, Trip } from '../types/tourism';
import {
  computeTripDurationDays,
  getLocalizedText,
  validateTripInput,
} from '../utils/tourismLogic';
import { TRANSLATIONS } from '../i18n/translations';

interface TripsViewProps {
  language: Language;
  trips: Trip[];
  destinations: Destination[];
  isAuthenticated: boolean;
  initialDestinationId?: number | null;
  onClearInitialDestination?: () => void;
  onCreateTrip: (payload: {
    title: string;
    startDate: string;
    endDate: string;
    notes: string;
    destinations: number[];
  }) => Promise<void>;
  onUpdateTrip: (
    id: number,
    payload: {
      title: string;
      startDate: string;
      endDate: string;
      notes: string;
      destinations: number[];
    }
  ) => Promise<void>;
  onDeleteTrip: (id: number) => Promise<void>;
  onSelectDestination: (destination: Destination) => void;
  onGoToProfile: () => void;
}

export function TripsView({
  language,
  trips,
  destinations,
  isAuthenticated,
  initialDestinationId,
  onClearInitialDestination,
  onCreateTrip,
  onUpdateTrip,
  onDeleteTrip,
  onSelectDestination,
  onGoToProfile,
}: TripsViewProps) {
  const t = TRANSLATIONS[language];
  const destMap = new Map(destinations.map((d) => [d.id, d]));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-12-15');
  const [endDate, setEndDate] = useState('2026-12-18');
  const [notes, setNotes] = useState('');
  const [selectedDestIds, setSelectedDestIds] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialDestinationId) {
      setEditingTrip(null);
      setTitle('');
      setStartDate('2026-12-15');
      setEndDate('2026-12-18');
      setNotes('');
      setSelectedDestIds([initialDestinationId]);
      setFormError(null);
      setModalOpen(true);
      onClearInitialDestination?.();
    }
  }, [initialDestinationId, onClearInitialDestination]);

  const openCreateModal = () => {
    setEditingTrip(null);
    setTitle('');
    setStartDate('2026-12-15');
    setEndDate('2026-12-18');
    setNotes('');
    setSelectedDestIds([]);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (trip: Trip) => {
    setEditingTrip(trip);
    setTitle(trip.title);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setNotes(trip.notes);
    setSelectedDestIds(trip.destinations.map((d) => d.destinationId));
    setFormError(null);
    setModalOpen(true);
  };

  const toggleDest = (id: number) => {
    setSelectedDestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTripInput({
      title,
      startDate,
      endDate,
      destinationIds: selectedDestIds,
    });
    if (!validation.valid && validation.errorKey) {
      setFormError(t.trips.validation[validation.errorKey]);
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        title: title.trim(),
        startDate,
        endDate,
        notes: notes.trim(),
        destinations: selectedDestIds,
      };
      if (editingTrip) {
        await onUpdateTrip(editingTrip.id, payload);
      } else {
        await onCreateTrip(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save travel plan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-bold text-[#17211C] ${language === 'km' ? 'khmer-text text-2xl sm:text-3xl' : ''}`}>
            {t.trips.title}
          </h1>
          <p className={`text-sm text-[#5A655F] mt-1 ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.trips.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D5C46] text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-[#0A4A38] transition-colors self-start whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{t.trips.newTripBtn}</span>
        </button>
      </div>

      {!isAuthenticated && (
        <div className="rounded-2xl bg-[#FFFDF7] border border-[#E8D9B0] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#6B4F06]">{t.trips.signInPrompt}</p>
          <button
            type="button"
            onClick={onGoToProfile}
            className="text-xs font-semibold text-[#0D5C46] hover:underline whitespace-nowrap"
          >
            {t.profile.signInBtn}
          </button>
        </div>
      )}

      {trips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-12 text-center max-w-xl mx-auto">
          <Calendar className="w-10 h-10 text-[#0D5C46] mx-auto mb-3" aria-hidden="true" />
          <h2 className={`text-xl font-semibold text-[#17211C] ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.trips.emptyTitle}
          </h2>
          <p className={`text-sm text-[#5A655F] mt-2 ${language === 'km' ? 'khmer-text' : ''}`}>
            {t.trips.emptyBody}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] transition-colors"
          >
            {t.trips.newTripBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trips.map((trip) => {
            const days = computeTripDurationDays(trip.startDate, trip.endDate);
            return (
              <article
                key={trip.id}
                className="bg-white rounded-2xl border border-[#E5E0D8] p-6 flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#5A655F] tabular-nums">
                        <span>
                          {trip.startDate} – {trip.endDate}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {days}{' '}
                          {language === 'km' ? t.trips.daysUnit : days === 1 ? 'day' : 'days'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {trip.destinations.length}{' '}
                          {language === 'km'
                            ? t.trips.stopsUnit
                            : trip.destinations.length === 1
                              ? 'stop'
                              : 'stops'}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#17211C] mt-1">{trip.title}</h2>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(trip)}
                        aria-label={`${t.trips.editTrip} ${trip.title}`}
                        className="min-w-[40px] min-h-[40px] rounded-xl border border-[#E5E0D8] flex items-center justify-center text-[#17211C] hover:bg-[#F8F7F4]"
                      >
                        <Edit3 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTrip(trip.id)}
                        aria-label={`${t.trips.deleteTrip} ${trip.title}`}
                        className="min-w-[40px] min-h-[40px] rounded-xl border border-[#E5E0D8] flex items-center justify-center text-[#B91C1C] hover:bg-[#FEF2F2]"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {trip.notes && (
                    <p className="mt-3 text-sm text-[#4B5650] leading-relaxed">{trip.notes}</p>
                  )}

                  <div className="mt-4 pt-4 border-t border-[#F0ECE4] space-y-2">
                    {trip.destinations.map((item, idx) => {
                      const dest = destMap.get(item.destinationId);
                      if (!dest) return null;
                      return (
                        <button
                          key={`${trip.id}-${dest.id}-${idx}`}
                          type="button"
                          onClick={() => onSelectDestination(dest)}
                          className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#F8F7F4] hover:bg-[#EFECE6] flex items-center justify-between text-left transition-colors"
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-[#0D5C46] text-white text-xs font-mono flex items-center justify-center shrink-0 tabular-nums">
                              {idx + 1}
                            </span>
                            <span className={`text-sm font-medium text-[#17211C] truncate ${language === 'km' ? 'khmer-text' : ''}`}>
                              {getLocalizedText(dest.nameEn, dest.nameKm, language)}
                            </span>
                          </span>
                          <span className="text-xs text-[#5A655F] inline-flex items-center gap-1 shrink-0 ml-2">
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            {getLocalizedText(dest.provinceEn, dest.provinceKm, language)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Create / Edit Trip Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trip-modal-heading"
        >
          <div className="bg-white rounded-3xl border border-[#E5E0D8] w-full max-w-2xl overflow-hidden max-h-[92dvh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFECE6]">
              <h2 id="trip-modal-heading" className="text-xl font-bold text-[#17211C]">
                {editingTrip ? t.trips.editTrip : t.trips.newTripBtn}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label={t.common.close}
                className="min-w-[40px] min-h-[40px] rounded-xl border border-[#E5E0D8] flex items-center justify-center text-[#17211C] hover:bg-[#F8F7F4]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-[#991B1B]"
                >
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="trip-title" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.trips.tripTitleLabel}
                </label>
                <input
                  id="trip-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.trips.tripTitlePlaceholder}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm text-[#17211C] focus:outline-2 focus:outline-[#0D5C46]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="trip-start" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                    {t.trips.startDateLabel}
                  </label>
                  <input
                    id="trip-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm text-[#17211C] tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="trip-end" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                    {t.trips.endDateLabel}
                  </label>
                  <input
                    id="trip-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8D2C5] text-sm text-[#17211C] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="trip-notes" className="block text-xs font-semibold text-[#17211C] mb-1.5">
                  {t.trips.notesLabel}
                </label>
                <textarea
                  id="trip-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.trips.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C5] text-sm text-[#17211C] focus:outline-2 focus:outline-[#0D5C46]"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-[#17211C] mb-2">
                  {t.trips.destinationsLabel} ({selectedDestIds.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1">
                  {destinations.map((dest) => {
                    const checked = selectedDestIds.includes(dest.id);
                    return (
                      <label
                        key={dest.id}
                        className={`min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer text-sm transition-colors ${
                          checked
                            ? 'border-[#0D5C46] bg-[#0D5C46]/5 text-[#0D5C46] font-medium'
                            : 'border-[#E5E0D8] text-[#17211C] hover:bg-[#F8F7F4]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDest(dest.id)}
                          className="accent-[#0D5C46] w-4 h-4"
                        />
                        <span className="truncate">
                          {getLocalizedText(dest.nameEn, dest.nameKm, language)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D8D2C5] text-sm font-medium text-[#17211C] hover:bg-[#F8F7F4]"
                >
                  {t.trips.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0D5C46] text-white text-sm font-medium hover:bg-[#0A4A38] disabled:opacity-60"
                >
                  {t.trips.saveTrip}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
