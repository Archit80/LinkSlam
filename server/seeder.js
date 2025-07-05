import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import User from "./src/models/user.js";
import Link from "./src/models/link.js";

dotenv.config();

const MONGO_URI = `${process.env.MONGO_URI}/LinkSlam-Production`;

const DESI_USERNAMES = [
  "chaiwala_007",
  "desi_gamer",
  "ladki_patrol",
  "nibba_cricketer",
  "pyaar_ka_pandit",
  "govt_job_seeker",
  "aunty_reels",
  "delhi_boy",
  "punjabi_jatt",
  "filter_kapi_lover",
  "biryani_queen",
  "south_ke_thalaiva",
  "btech_murga",
  "bollywood_buff",
  "pg_life_survivor",
];

const DESI_NAMES = [
  "Rohan Bhardwaj",
  "Priya Yadav",
  "Ankit Sharma",
  "Sneha Patel",
  "Rahul Taneja",
  "Simran Kaur",
  "Aamir Sheikh",
  "Nisha Verma",
  "Kunal Joshi",
  "Pooja Iyer",
  "Devika Rao",
  "Manish Rathi",
  "Lakshmi Menon",
  "Ayaan Khan",
  "Tanya Sethi",
];

const DESI_TITLES = [
  "Top 5 pani puri spots in Mumbai",
  "Why every Indian mom uses plastic dabbas",
  "How to survive Indian weddings",
  "Jugaad hacks for broke students",
  "Best biryani recipe in Hyderabad",
  "Every Delhi guy at CP be like...",
  "Ranking Indian soaps from cringe to cringe++",
  "This IAS aspirant’s daily routine will shock you",
  "How to impress a desi girl (not clickbait)",
  "Swiggy vs Zomato: The ultimate showdown",
  "Why Indian dads love WhatsApp forwards",
  "Real struggle of finding PG in Bangalore",
  "Are Bollywood movies ruining your brain?",
  "Govt job prep in 2025: Full guide",
  "Most underrated chai stalls in India",
  "Desi jugaad that actually works",
  "Engineering memes that hit too hard",
  "Aunty spotted: The real neighborhood spy",
  "Things only Indians say in traffic",
  "Life lessons from Indian auto rickshaw drivers",
];

const REAL_URLS = [
  // 🇮🇳 Indian
  "https://www.ndtv.com",
  "https://www.indiatoday.in",
  "https://www.cricbuzz.com",
  "https://www.zomato.com",
  "https://www.swiggy.com",
  "https://www.irctc.co.in",
  "https://www.makemytrip.com",
  "https://www.bookmyshow.com",
  "https://www.oyorooms.com",
  "https://www.1mg.com",
  "https://www.flipkart.com",
  "https://www.jiosaavn.com",
  "https://www.hotstar.com/in",
  "https://www.sarkariresult.com",
  "https://www.byjus.com",

  // 🌍 International
  "https://www.nytimes.com",
  "https://www.bbc.com",
  "https://www.cnn.com",
  "https://www.github.com",
  "https://www.stackoverflow.com",
  "https://www.medium.com",
  "https://www.producthunt.com",
  "https://www.ted.com",
  "https://www.theverge.com",
  "https://www.reddit.com",
  "https://www.wired.com",
  "https://www.nationalgeographic.com",
  "https://www.techcrunch.com",
  "https://www.nasa.gov",
  "https://www.spotify.com",
  "https://www.netflix.com",
  "https://www.linkedin.com",
  "https://www.instagram.com",
  "https://www.twitter.com",
  "https://www.khanacademy.org",
  "https://www.coursera.org",
];

const DESI_BIOS = [
  "Chai runs in my veins and sarcasm is my second language. Born to scroll, cursed to code. If I'm not debugging, I'm probably binge-watching 00s rom-coms and overanalyzing why Sid didn’t pick Aisha in Wake Up Sid.",

  "Part-time MBA student, full-time overthinker. I once cried because my Maggi turned out soggy and now I have trust issues. Manifesting free WiFi and an emotionally available crush.",

  "I studied engineering to make my parents proud, but now I run a meme page and explain reels to them over dinner. One day I’ll go viral — if not for talent, then definitely for my relatives’ drama.",

  "Broke but bougie. I attend online webinars with my video off and pretend I’m taking notes. Fluent in Hinglish, emoji, and sending ‘K?’ as a threat. Still waiting for my big break... or a biryani sponsorship.",

  "I believe in destiny, karma, and the holy trinity of Rajma Chawal, power naps, and midweek existential crises. Currently surviving on deadlines, dopamine hits, and daily doses of cringe Insta reels.",

  "Coding by day, crying by night. My toxic trait is starting new projects every weekend and abandoning them faster than my gym resolutions. Catch me romanticizing my life while refreshing GitHub stats.",

  "Raised on DD National and emotional manipulation. I say ‘bro’ 43 times a day and pretend I know what I’m doing. My dog has more followers than me, and honestly, he deserves it.",

  "Ex-tuition topper, now a recovering LinkedIn motivational quote poster. I once got ghosted by a recruiter and I’m still not over it. Living proof that ‘acha beta hai’ can write slightly toxic JavaScript.",

  "Once called ‘Sharma ji ka beta’… until I became a UX designer. I enjoy ruining UI with 15 different font choices and calling it minimal. Ask me about my startup idea that will never launch.",

  "Too filmy for tech, too techie for film. I like long walks to the fridge, deep conversations with ChatGPT, and pretending I understand crypto. Side hustle? Giving life advice to strangers on Reddit.",

  "Will fight anyone who disrespects dahi puri. My career plan is 20% hard work and 80% vibes. I don’t know if I’m thriving or just really good at faking productivity on Notion.",

  "Middle child with WiFi issues. Once got into a serious argument over best samosa spot in Delhi. Fluent in family drama, procrastination, and Googling ‘how to make money fast’ at 2am.",

  "Once accidentally sent a voice note of me snoring in a professional group chat. Now I live in fear and caffeine. Current mood: searching ‘remote jobs for people who hate Zoom.’",

  "Grew up on Cartoon Network, now stuck in meetings that could’ve been emails. Passionate about pani puri, parallel parking, and pretending I’m okay after a code merge conflict.",

  "They told me to follow my dreams, so I now nap regularly. Daydreaming about quitting my job and opening a tiffin service called ‘Code & Curry’. My biggest flex? I once replied to a recruiter in 2 minutes.",

  "If there was a degree for overthinking, I’d have a PhD. I once had a 45-minute debate over the superior Indian snack — ended in tears and a pack of Haldiram’s. Current hobby: overusing the 🫠 emoji.",

  "I code like I live — chaotically and full of TODOs. My parents think I work at ‘Google ke jaise kuch’ and I’ve stopped correcting them. Currently stuck between being a minimalist and hoarding Notion templates.",

  "Started as a JEE aspirant, ended up as a meme page admin. I speak fluent sarcasm and broken Python. Looking for someone who’ll argue passionately about filter coffee vs chai with me.",

  "Once gave a TED Talk in my sleep (source: mom). Manifesting a life where my code compiles on first try and I get paid to do nothing but vibe in Goa. Until then, back to Figma and fake deadlines.",

  "Left my 9-5 to follow my passion. Now unemployed and eating Maggi for dinner — no regrets. If this bio goes viral, I promise to finally push that project to GitHub.",

  "I’m not saying I’m the next Steve Jobs, but I did once fix my WiFi by yelling at it. Currently accepting donations for my ‘Buy a Laptop’ fund. My hobbies include scrolling through memes and pretending to be productive.",
  "I once tried to explain blockchain to my grandma and now she thinks I’m a hacker. Living proof that you can be both a techie and a desi drama queen. My life goal? To make chai that even my mom approves of.",
  "Small town guy with big dreams of making it in the tech world. Currently juggling DSA prep and my mom yelling at me to get married before 25.",
  "Final-year engineering student who’s been 'figuring it out' since first year. Addicted to chai, Bollywood, and building side projects I’ll never finish.",
  "Just a Delhi girl trying to survive without getting into a fight over momo chutney. UI/UX designer by day, Instagram meme curator by night.",
  "Recovering CA aspirant now diving deep into startups and product design. Powered by coffee, ambition, and random Shark Tank pitches at 3am.",
  "Love coding, but love biryani more. Currently working on an app no one asked for. Dream is to retire young and open a chai thela in Manali.",
  "Ex-JEE aspirant turned freelance graphic designer. Manifesting Maldives trips while stuck in the Delhi Metro every morning.",
  "MBA student who once went viral for dancing at a wedding. Believes in manifestation, manifestation, and more manifestation.",
  "Part-time coder, full-time elder sibling. Trying to explain to my parents what a 'frontend dev' is for the 4th time this week.",
  "Born in Kanpur, based in Bengaluru, and forever emotionally stuck in 2012. I code, write poetry, and occasionally cry at Coke Studio.",
  "Swiggy Super subscriber with a plan to never cook again. Software engineer who says 'bro deploy ho gaya' like it’s therapy.",
  "Middle-class philosopher. I overthink, overeat, and overwatch anime like it’s my job. Still waiting for that one HR callback.",
  "Small village, big ideas. Building Bharat-focused solutions that actually help people — not just VC decks. Will pitch to anyone who listens.",
  "Was going to become a doctor but ended up writing code. Now I debug like I used to cram biology — one panic attack at a time.",
  "UX designer who believes color palettes say more about your soul than your horoscope. Also deeply invested in pani puri wars.",
  "Digital marketer by profession, astrologer by curiosity. I run ad campaigns and also give unsolicited relationship advice.",
  "Still can’t believe I’m getting paid to write JavaScript. It started with a tutorial and now I’m fighting for dark mode in every project.",
  "Call center rep with dreams of becoming the next big voiceover artist. My dream role? Narrating Bigg Boss intros.",
  "My mom thinks I’m a hacker because I fixed the WiFi once. Trying to live up to it now by learning full-stack development.",
  "Trying to be the ‘tech guy’ in every friend group while secretly Googling everything. Still haven’t figured out useEffect.",
  "Left the rat race of NEET for the chaos of startups. I write code, pitch products, and still don’t know how taxes work.",
  "I once coded a website in 3 hours and now I’m convinced I can do anything. Currently accepting challenges that involve chai breaks.",
  "I’m not saying I’m the next Elon Musk, but I did once fix my WiFi by yelling at it. Currently accepting donations for my ‘Buy a Laptop’ fund. My hobbies include scrolling through memes and pretending to be productive.",
];

const TAGS_POOL = [
  "bollywood",
  "cricket",
  "jugaad",
  "chai",
  "pani-puri",
  "politics",
  "rahul-gandhi",
  "modi",
  "startup-india",
  "techie",
  "iit",
  "gate",
  "desi-memes",
  "shaadi",
  "sanskari",
  "nibba-nibbi",
  "indian-parents",
  "arranged-marriage",
  "budget-travel",
  "bike-life",
  "sabzi-market",
  "swiggy",
  "zomato",
  "jio",
  "desi-hacks",
  "chai-sutta",
  "indian-tv",
  "kdrama-but-desi",
  "biryani",
  "street-food",
  "rickshaw",
  "pg-life",
  "jobless",
  "delhi",
  "mumbai",
  "lucknow",
  "south-india",
  "north-india",
  "hindi",
  "sanskrit",
  "temple",
  "bhakti",
  "filmy",
  "reels",
  "govt-jobs",
  "engineering",
  "whatsapp-uncles",
  "horoscope",
  "astrology",
  "cowin",
  "paratha",
  "baba-ramdev",
  "indian-twitter",
];

const PREVIEW_IMAGES = [
  "https://images.pexels.com/photos/57901/pexels-photo-57901.jpeg",
  "https://images.unsplash.com/photo-1517330357046-3ab5a5dd42a1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.pexels.com/photos/672630/pexels-photo-672630.jpeg",
  "https://images.pexels.com/photos/618491/pexels-photo-618491.jpeg",
  "https://images.pexels.com/photos/974320/pexels-photo-974320.jpeg",
  "https://images.pexels.com/photos/2730218/pexels-photo-2730218.jpeg",
  "https://images.pexels.com/photos/618116/pexels-photo-618116.jpeg",
  "https://images.pexels.com/photos/2780244/pexels-photo-2780244.jpeg",
  "https://images.pexels.com/photos/2382889/pexels-photo-2382889.jpeg",
  "https://images.pexels.com/photos/1806064/pexels-photo-1806064.jpeg",
  "https://images.pexels.com/photos/899357/pexels-photo-899357.jpeg",
  "https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg",
  "https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg",
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
  "https://images.pexels.com/photos/849816/pexels-photo-849816.jpeg",
  "https://images.pexels.com/photos/164636/pexels-photo-164636.jpeg",
  "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1691030658389-38b0b01903e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGluZGlhJTIwc3RyZWV0fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1662663489488-1b9541a04136?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGluZGlhJTIwc3RyZWV0fGVufDB8fDB8fHww",
];

const PROFILE_IMAGES = [
  "https://images.pexels.com/photos/938639/pexels-photo-938639.jpeg",
  "https://images.pexels.com/photos/2085739/pexels-photo-2085739.jpeg",
  "https://images.pexels.com/photos/1624727/pexels-photo-1624727.jpeg",
  "https://images.pexels.com/photos/3665348/pexels-photo-3665348.jpeg",
  "https://images.pexels.com/photos/3273873/pexels-photo-3273873.jpeg",
  "https://images.unsplash.com/photo-1624610261655-777af2f586d7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.pexels.com/photos/802457/pexels-photo-802457.jpeg",
  "https://images.pexels.com/photos/4406759/pexels-photo-4406759.jpeg",
  "https://images.pexels.com/photos/4307884/pexels-photo-4307884.jpeg",
  "https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg",
];

const getRandom = (arr) => faker.helpers.arrayElement(arr);

const generateFakeUsers = (count = 12, images = PROFILE_IMAGES) => {
  const shuffledImages = faker.helpers.shuffle(images); // shuffle once
  return Array.from({ length: count }).map((_, i) => {
    const name = getRandom(DESI_NAMES);
    const username =
      getRandom(DESI_USERNAMES) + faker.number.int({ min: 1, max: 999 });
    return {
      name,
      username: username.toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      bio: getRandom(DESI_BIOS),
      password: faker.internet.password(),
      profileImage: {
        url: shuffledImages[i] || getRandom(images), // no repeat if enough images
        public_id: faker.string.uuid(),
      },
    };
  });
};

const generateFakeLinks = (users, count = 20, images = PREVIEW_IMAGES) =>
  Array.from({ length: count }).map((_, i) => {
    const user = getRandom(users);
    return {
      url: getRandom(REAL_URLS),
      title: getRandom(DESI_TITLES),
      tags: faker.helpers.arrayElements(
        TAGS_POOL,
        faker.number.int({ min: 2, max: 4 })
      ),
      isPublic: faker.datatype.boolean({ probability: 0.99 }),
      isNSFW: faker.datatype.boolean({ probability: 0.19 }),
      previewImage: images?.[i] || getRandom(PREVIEW_IMAGES),
      likes: [],
      saves: [],
      userId: user._id,
      sourceId: null,
    };
  });

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected to LinkSlam-Production");

    await User.deleteMany();
    await Link.deleteMany();
    console.log("🧹 Cleared existing users & links");

    const shuffledImages = faker.helpers.shuffle(PREVIEW_IMAGES);

    const users = await User.insertMany(
      generateFakeUsers(10, PROFILE_IMAGES)
    );
    console.log(`👥 Seeded ${users.length} users`);

    // const shuffledImages = faker.helpers.shuffle(PREVIEW_IMAGES);

    const links = await Link.insertMany(
      generateFakeLinks(users, 30, shuffledImages)
    );

    console.log(`🔗 Seeded ${links.length} links`);

    for (const user of users) {
      const liked = faker.helpers
        .arrayElements(links, 3)
        .map((link) => link._id);
      const saved = faker.helpers
        .arrayElements(links, 2)
        .map((link) => link._id);
      user.likedLinks = liked;
      user.savedLinks = saved;
      await user.save();

      await Link.updateMany(
        { _id: { $in: liked } },
        { $addToSet: { likes: user._id } }
      );
      await Link.updateMany(
        { _id: { $in: saved } },
        { $addToSet: { saves: user._id } }
      );
    }

    console.log("❤️ Liked/saved links updated");
    process.exit(0);
  } catch (err) {
    console.error("💥 Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
