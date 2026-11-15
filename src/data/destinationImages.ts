import angkorWatImg from '../assets/images/angkor_wat_sunrise_1794715362882.jpg';
import bayonImg from '../assets/images/bayon_temple_faces_1794715362725.jpg';
import taProhmImg from '../assets/images/ta_prohm_roots_1794715363954.jpg';
import royalPalaceImg from '../assets/images/phnom_penh_palace_1794715363627.jpg';
import independenceImg from '../assets/images/independence_monument_pp_1794715381911.jpg';
import kohRongImg from '../assets/images/koh_rong_island_1794715364144.jpg';
import bokorImg from '../assets/images/bokor_mountain_plateau_1794715381263.jpg';
import kampotRiverImg from '../assets/images/kampot_bokor_river_1794715364631.jpg';
import bambooTrainImg from '../assets/images/battambang_bamboo_train_1794715368569.jpg';
import phnomKulenImg from '../assets/images/phnom_kulen_waterfall_1794715365085.jpg';
import nationalMuseumImg from '../assets/images/national_museum_pp_1794715954321.jpg';

export const DESTINATION_IMAGES: Record<string, string> = {
  angkor_wat: angkorWatImg,
  bayon_temple: bayonImg,
  ta_prohm: taProhmImg,
  royal_palace: royalPalaceImg,
  independence_monument: independenceImg,
  koh_rong: kohRongImg,
  bokor_mountain: bokorImg,
  kampot_river: kampotRiverImg,
  bamboo_train: bambooTrainImg,
  phnom_kulen: phnomKulenImg,
  national_museum: nationalMuseumImg,
};

export function resolveDestinationImage(imageKey: string, imageUrl?: string): string | undefined {
  if (imageUrl && imageUrl.trim().length > 0) {
    return imageUrl;
  }
  return DESTINATION_IMAGES[imageKey] ?? angkorWatImg;
}
