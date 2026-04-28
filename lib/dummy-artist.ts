import artist1 from '@/assets/images/artists_one.jpg';
import artistBanner from '@/assets/images/artists_banner.png';
import type { Artist } from '@/interfaces/artist.interface';

// ─── Mock Data ─────────────────────────────────────────────────────────────

const artists_image_url = artist1;
const artists_banner_url = artistBanner;

export const mockArtists: Artist[] = [
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567801",
        name: "Amara Diallo",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Afrobeats vocalist blending West African rhythms with contemporary R&B, based in Brooklyn.",
        genres: ["Afrobeats", "R&B", "Highlife"],
        social_links: {
            instagram: "https://instagram.com/beyonce",
            twitter: "https://twitter.com/beyonce",
            spotify: "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m",
            youtube: "https://youtube.com/@Beyonce",
        },
        is_wishlisted: false,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567802",
        name: "Lena Vasquez",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Soulful R&B singer-songwriter from Harlem with a passion for storytelling through music.",
        genres: ["R&B", "Soul", "Neo-Soul"],
        social_links: {
            instagram: "https://instagram.com/selenagomez",
            spotify: "https://open.spotify.com/artist/0C8ZW7ezQVs4URX5aX7Kqx",
            youtube: "https://youtube.com/@selenagomez",
        },
        is_wishlisted: true,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567803",
        name: "Kai Nakamura",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Jazz pianist and composer from Queens, drawing on Japanese folk melodies and bebop traditions.",
        genres: ["Jazz", "Fusion", "Experimental"],
        social_links: {
            instagram: "https://instagram.com/johnlegend",
            twitter: "https://twitter.com/johnlegend",
            spotify: "https://open.spotify.com/artist/5y2Xq6xcjJb2jVM54GHK3t",
        },
        is_wishlisted: false,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567804",
        name: "Priya Sharma",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Neo-Soul artist from the Bronx weaving Bollywood influences into her lush, layered soundscapes.",
        genres: ["Neo-Soul", "Indie R&B", "World"],
        social_links: {
            instagram: "https://instagram.com/arianagrande",
            twitter: "https://twitter.com/arianagrande",
            spotify: "https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR",
            youtube: "https://youtube.com/@ArianaGrande",
        },
        is_wishlisted: false,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567805",
        name: "Marcus Osei",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Staten Island MC dropping conscious hip-hop bars rooted in Pan-African identity and community.",
        genres: ["Hip-Hop", "Conscious Rap", "Spoken Word"],
        social_links: {
            instagram: "https://instagram.com/drake",
            twitter: "https://twitter.com/drake",
            youtube: "https://youtube.com/@DrakeOfficial",
        },
        is_wishlisted: false,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567806",
        name: "Sofia Mendez",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Brooklyn-based Latin pop powerhouse fusing cumbia rhythms with modern pop production.",
        genres: ["Latin Pop", "Cumbia", "Reggaeton"],
        social_links: {
            instagram: "https://instagram.com/shakira",
            spotify: "https://open.spotify.com/artist/0EmeFodog0BfCgMzAIvKQp",
            youtube: "https://youtube.com/@shakira",
        },
        is_wishlisted: true,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567807",
        name: "Devon Carter",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Gospel and soul vocalist from Harlem whose powerful voice has graced stages across the globe.",
        genres: ["Gospel", "Soul", "R&B"],
        social_links: {
            instagram: "https://instagram.com/theweeknd",
            twitter: "https://twitter.com/theweeknd",
            spotify: "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ",
            youtube: "https://youtube.com/@TheWeeknd",
        },
        is_wishlisted: false,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567808",
        name: "Yuki Tanaka",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Electronic music producer from Queens crafting ambient soundscapes and hypnotic club tracks.",
        genres: ["Electronic", "Ambient", "Club"],
        social_links: {
            instagram: "https://instagram.com/martingarrix",
            spotify: "https://open.spotify.com/artist/60d24wfXkVzDSfLS6hyCjZ",
            youtube: "https://youtube.com/@MartinGarrix",
        },
        is_wishlisted: false,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567809",
        name: "Zara Ahmed",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Bronx-born reggaeton artist whose bilingual anthems have topped Latin charts internationally.",
        genres: ["Reggaeton", "Latin Trap", "Pop"],
        social_links: {
            instagram: "https://instagram.com/badbunnypr",
            twitter: "https://twitter.com/badbunny_pr",
            spotify: "https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X",
            youtube: "https://youtube.com/@BadBunnyOfficial",
        },
        is_wishlisted: false,
    },
    {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567810",
        name: "Elijah Brooks",
        image_url: artists_image_url,
        banner_url: artists_banner_url,
        bio: "Soul troubadour from Brooklyn channeling the golden era of Motown into fresh modern recordings.",
        genres: ["Soul", "Funk", "Motown"],
        social_links: {
            instagram: "https://instagram.com/brunomars",
            spotify: "https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C",
            youtube: "https://youtube.com/@BrunoMars",
        },
        is_wishlisted: false,
    },
]