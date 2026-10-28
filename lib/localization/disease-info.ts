export type LocalizedDiseaseInfo = {
  diseaseId: string;
  name: string;
  explanation: string;
  symptoms: readonly string[];
  actions: readonly string[];
  treatment: readonly string[];
  prevention: readonly string[];
  warning: string;
  assistance: string;
};

export type SupportedLanguage = "en" | "rw";

const blight = (diseaseId: string, name: string, crop: string): LocalizedDiseaseInfo => ({
  diseaseId,
  name,
  explanation: `Ishusho yerekana ko ${crop} ishobora kuba ifite iyi ndwara. Ibi ni ubufasha bw'ikoranabuhanga, si isuzuma ridashidikanywaho.`,
  symptoms: ["Amababi agira utubara twijimye cyangwa duhinduye ibara.", "Amababi ashobora kuba umuhondo, kuma cyangwa kugwa.", "Ibimenyetso bishobora kwiyongera mu gihe cy'imvura cyangwa ubuhehere bwinshi."],
  actions: ["Reba n'ibindi bihingwa, cyane cyane amababi yo hasi.", "Kuraho ibice byangiritse cyane, ubishyire kure y'ibihingwa bizima.", "Saba umukozi w'ubujyanama mu buhinzi kugenzura indwara."],
  treatment: ["Kuraho amababi yanduye cyane igihe amababi yumye, uyashyire kure y' umurima.", "Vomerera ku butaka aho gutosa amababi, kandi utere amazi mu gitondo kugira ngo amababi yumuke vuba.", "Ku muti wica indwara, banza ubaze umukozi w'ubujyanama mu buhinzi kandi ukurikize amabwiriza ari ku gipfunyika cy'umuti wemewe."],
  prevention: ["Irinde gutosa amababi igihe uvomera, kandi utere amazi ku butaka.", "Ha ibihingwa umwanya uhagije kugira ngo umwuka unyuremo.", "Kuraho ibisigazwa by'ibihingwa nyuma y'isarura."],
  warning: "Ibimenyetso bisa bishobora guterwa n'indwara zitandukanye. Ntukoreshe umuti wica udukoko utabanje kugisha inama kandi utabanje gusoma amabwiriza yawo.",
  assistance: "Niba indwara ikwirakwira vuba cyangwa ifata ibihingwa byinshi, hamagara umukozi w'ubujyanama mu buhinzi.",
});

const healthy = (diseaseId: string, crop: string): LocalizedDiseaseInfo => ({
  diseaseId,
  name: `${crop} isa n'ifite ubuzima bwiza`,
  explanation: "Iyi foto ntiyagaragaje imwe mu ndwara ziri ku rutonde rw'iyi porogaramu.",
  symptoms: [],
  actions: ["Komeza kugenzura ibihingwa byawe buri gihe.", "Niba hagaragaye ibimenyetso bishya cyangwa bikiyongera, saba ubufasha."],
  treatment: ["Nta muti wihariye utangwa kuri iri suzuma. Komeza kugenzura igihingwa kandi ushake ubufasha niba ibimenyetso byiyongera."],
  prevention: ["Irinde gutosa amababi igihe uvomera.", "Ha ibihingwa umwanya uhagije kugira ngo umwuka unyuremo.", "Kuraho ibisigazwa by'ibihingwa nyuma y'isarura."],
  warning: "Kuvuga ko igihingwa gisa n'ikizima ntibivuze ko nta ndwara gifite. Ntukoreshe umuti wica udukoko utabanje kugisha inama.",
  assistance: "Saba umukozi w'ubujyanama mu buhinzi kugenzura ibimenyetso bishya cyangwa bikomeza kwiyongera.",
});

// NOTE: Kinyarwanda text for the virus and spider-mite templates and the new disease names is a draft;
// have it reviewed by a native speaker and an agronomist before release.
const virus = (diseaseId: string, name: string, symptoms: readonly string[], spreadAdvice: string): LocalizedDiseaseInfo => ({
  diseaseId,
  name,
  explanation: "Ishusho yerekana ko inyanya zishobora kuba zifite indwara iterwa na virusi. Ibi ni ubufasha bw'ikoranabuhanga, si isuzuma ridashidikanywaho.",
  symptoms,
  actions: ["Reba n'ibindi bihingwa biri hafi.", "Ranura ibihingwa byanduye cyane ubijyane kure y'umurima.", "Saba umukozi w'ubujyanama mu buhinzi kugenzura indwara."],
  treatment: ["Nta muti uvura indwara ziterwa na virusi. Gukuraho ibihingwa byanduye bifasha kurinda ibindi.", spreadAdvice],
  prevention: ["Koresha ingemwe zizima, kandi uhitemo ubwoko bwihanganira indwara niba buhari.", "Kuraho ibyatsi bibi bikikije umurima.", "Ntukoreshe imbuto zavuye ku bihingwa byanduye."],
  warning: "Ibimenyetso bisa bishobora guterwa n'ibindi bibazo, nk'ibura ry'intungamubiri. Ntukoreshe umuti utabanje kugisha inama.",
  assistance: "Niba indwara ifata ibihingwa byinshi, hamagara umukozi w'ubujyanama mu buhinzi.",
});

const mites = (diseaseId: string, name: string): LocalizedDiseaseInfo => ({
  diseaseId,
  name,
  explanation: "Ishusho yerekana ko inyanya zishobora kuba zifite udusimba duto twitwa spider mites. Ibi ni ubufasha bw'ikoranabuhanga, si isuzuma ridashidikanywaho.",
  symptoms: ["Utudomo duto tw'umuhondo cyangwa umweru ku mababi.", "Utudodo duto tumeze nk'urutagangurirwa munsi y'amababi.", "Amababi ashobora kuma no kugwa, cyane cyane mu gihe cy'izuba ryinshi."],
  actions: ["Reba munsi y'amababi niba hari udusimba duto.", "Kuraho amababi yanduye cyane.", "Saba umukozi w'ubujyanama mu buhinzi kwemeza ikibazo."],
  treatment: ["Mesa amababi n'amazi meza, cyane cyane munsi yayo, kugira ngo ugabanye udusimba.", "Ku muti wica udusimba, banza ubaze umukozi w'ubujyanama mu buhinzi kandi ukurikize amabwiriza ari ku gipfunyika."],
  prevention: ["Vomera neza mu gihe cy'izuba kugira ngo ibihingwa bitagira umwuma.", "Kuraho ibyatsi bibi n'ibisigazwa by'ibihingwa.", "Genzura ibihingwa kenshi mu gihe cy'izuba."],
  warning: "Spider mites ni udukoko, si indwara iterwa n'uduhumyo. Imiti y'uduhumyo ntiyabica. Ntukoreshe umuti utabanje kugisha inama.",
  assistance: "Niba udusimba twiyongera vuba, hamagara umukozi w'ubujyanama mu buhinzi.",
});

export const DISEASE_INFO_RW: Readonly<Record<string, LocalizedDiseaseInfo>> = {
  potato_early_blight: blight("potato_early_blight", "Ibibara by'amababi ku birayi (Early blight)", "ibirayi"),
  potato_late_blight: blight("potato_late_blight", "Indwara ikwirakwira vuba ku birayi (Late blight)", "ibirayi"),
  tomato_early_blight: blight("tomato_early_blight", "Ibibara by'amababi ku nyanya (Early blight)", "inyanya"),
  tomato_late_blight: blight("tomato_late_blight", "Indwara ikwirakwira vuba ku nyanya (Late blight)", "inyanya"),
  potato_healthy: healthy("potato_healthy", "ibirayi"),
  tomato_healthy: healthy("tomato_healthy", "inyanya"),
  tomato_bacterial_spot: blight("tomato_bacterial_spot", "Ibibara bya bagiteri ku mababi y'inyanya (Bacterial spot)", "inyanya"),
  tomato_leaf_mold: blight("tomato_leaf_mold", "Uruhumbu ku mababi y'inyanya (Leaf mold)", "inyanya"),
  tomato_septoria_leaf_spot: blight("tomato_septoria_leaf_spot", "Ibibara bito ku mababi y'inyanya (Septoria leaf spot)", "inyanya"),
  tomato_target_spot: blight("tomato_target_spot", "Ibibara bimeze nk'intego ku nyanya (Target spot)", "inyanya"),
  tomato_yellow_leaf_curl_virus: virus("tomato_yellow_leaf_curl_virus", "Virusi ihinira amababi y'inyanya (Yellow leaf curl virus)", ["Amababi aba mato, akizinga hejuru kandi agahinduka umuhondo ku nkengero.", "Igihingwa ntigikura neza kandi cyera imbuto nke."], "Rwanya isazi z'umweru (whiteflies) zikwirakwiza iyi virusi, ubanje kugisha inama umukozi w'ubujyanama mu buhinzi."),
  tomato_mosaic_virus: virus("tomato_mosaic_virus", "Virusi ya mozayike ku nyanya (Mosaic virus)", ["Amababi agira ibara ry'icyatsi rivanze n'umuhondo.", "Amababi ashobora kwihinahina cyangwa gukura nabi."], "Karaba intoki kandi usukure ibikoresho nyuma yo gukora ku bihingwa byanduye."),
  tomato_spider_mites: mites("tomato_spider_mites", "Udusimba duto ku nyanya (Spider mites)"),
};

const englishNames: Readonly<Record<string, string>> = {
  potato_early_blight: "Potato early blight", potato_late_blight: "Potato late blight", potato_healthy: "Potato appears healthy",
  tomato_early_blight: "Tomato early blight", tomato_late_blight: "Tomato late blight", tomato_healthy: "Tomato appears healthy",
  tomato_bacterial_spot: "Tomato bacterial spot", tomato_leaf_mold: "Tomato leaf mold", tomato_septoria_leaf_spot: "Tomato Septoria leaf spot", tomato_target_spot: "Tomato target spot",
  tomato_yellow_leaf_curl_virus: "Tomato yellow leaf curl virus", tomato_mosaic_virus: "Tomato mosaic virus", tomato_spider_mites: "Tomato spider mites",
};

const englishVirus = (symptoms: readonly string[], spreadAdvice: string) => ({
  explanation: "This is an AI-assisted prediction of a virus disease, not a confirmed diagnosis.", symptoms,
  actions: ["Inspect nearby plants.", "Uproot badly affected plants and remove them from the field.", "Ask an agricultural extension worker to confirm the diagnosis."],
  treatment: ["There is no cure for plant virus diseases. Removing infected plants helps protect the rest.", spreadAdvice],
  prevention: ["Use healthy seedlings and resistant varieties where available.", "Remove weeds around the field.", "Do not save seed from infected plants."],
  warning: "Similar symptoms can be caused by other problems, such as nutrient deficiency. Do not use a chemical product without advice.",
  assistance: "Contact an agricultural extension worker if many plants are affected.",
});
const ENGLISH_OVERRIDES: Readonly<Record<string, Partial<LocalizedDiseaseInfo>>> = {
  tomato_yellow_leaf_curl_virus: englishVirus(["Small leaves that curl upward with yellow edges", "Stunted plants with few fruits"], "Control whiteflies, which spread this virus, after asking an extension worker for advice."),
  tomato_mosaic_virus: englishVirus(["Light and dark green or yellow mottled leaves", "Leaves may be wrinkled or misshapen"], "Wash hands and clean tools after touching infected plants."),
  tomato_spider_mites: {
    explanation: "This is an AI-assisted prediction of spider mites (a pest), not a confirmed diagnosis.",
    symptoms: ["Tiny yellow or white speckles on leaves", "Fine webbing under leaves", "Leaves may dry and drop, especially in hot, dry weather"],
    actions: ["Check the undersides of leaves for tiny mites.", "Remove heavily infested leaves.", "Ask an agricultural extension worker to confirm."],
    treatment: ["Spray leaves, especially the undersides, with clean water to reduce mites.", "Ask an agricultural extension worker about any approved miticide and follow the product label exactly."],
    prevention: ["Water well in dry weather so plants are not stressed.", "Remove weeds and crop remains.", "Check plants often during dry periods."],
    warning: "Spider mites are pests, not a fungal disease, so fungicides will not control them. Do not use a chemical product without advice.",
    assistance: "Contact an agricultural extension worker if mites spread quickly.",
  },
};

export function getDiseaseInfo(id: string, language: SupportedLanguage = "rw"): LocalizedDiseaseInfo {
  if (language === "rw") return getDiseaseInfoRw(id);
  const info = getDiseaseInfoRw(id);
  if (ENGLISH_OVERRIDES[id]) return { ...info, name: englishNames[id] ?? info.name, ...ENGLISH_OVERRIDES[id] };
  if (id.endsWith("_healthy")) return { ...info, name: englishNames[id] ?? "Crop appears healthy", explanation: "No supported disease was detected by the model.", symptoms: [], actions: ["Continue checking the crop regularly.", "Ask an agricultural extension worker if new or worsening symptoms appear."], treatment: ["No specific treatment is indicated by this result. Continue monitoring the crop and seek advice if symptoms appear."], prevention: ["Keep foliage dry where practical.", "Give plants enough space for air movement.", "Remove crop remains after harvest."], warning: "A healthy prediction does not guarantee that a plant is disease-free.", assistance: "Ask an agricultural extension worker if symptoms appear or worsen." };
  return { ...info, name: englishNames[id] ?? "Crop assessment", explanation: "This is an AI-assisted prediction, not a confirmed diagnosis.", symptoms: info.symptoms.length ? ["Dark or discolored leaf spots", "Leaves may yellow, dry, or fall", "Symptoms may worsen in wet weather"] : [], actions: ["Inspect nearby plants, especially older leaves.", "Remove severely affected plant parts and keep them away from healthy crops.", "Ask an agricultural extension worker to confirm the diagnosis."], treatment: ["Remove severely affected leaves when they are dry and dispose of them away from the field.", "Water the soil rather than wetting leaves, preferably early so foliage can dry.", "Ask an agricultural extension worker about any approved treatment and follow the product label exactly."], prevention: ["Keep leaves dry where practical and water the soil.", "Give plants enough space for air movement.", "Remove crop remains after harvest."], warning: "Similar symptoms can have different causes. Do not use a chemical product unless it is approved locally and its label is followed.", assistance: "Seek an agricultural extension worker if symptoms spread quickly or affect many plants." };
}

export function getDiseaseInfoRw(diseaseId: string): LocalizedDiseaseInfo {
  return DISEASE_INFO_RW[diseaseId] ?? {
    diseaseId,
    name: "Ibisubizo by'isuzuma",
    explanation: "Iyi ni porogaramu ifasha gutanga igitekerezo ku ndwara z'ibihingwa.",
    symptoms: ["Reba impinduka ku mababi, ku giti cyangwa ku mbuto."],
    actions: ["Saba umukozi w'ubujyanama mu buhinzi kugenzura igihingwa."],
    treatment: ["Banza ubaze umukozi w'ubujyanama mu buhinzi mbere yo gukoresha umuti uwo ari wo wose."],
    prevention: ["Komeza kugenzura ibihingwa byawe buri gihe."],
    warning: "Ibi ni igitekerezo cy'ubwenge buhangano, si isuzuma ridashidikanywaho.",
    assistance: "Saba ubufasha bw'umukozi w'ubujyanama mu buhinzi niba ufite impungenge.",
  };
}
