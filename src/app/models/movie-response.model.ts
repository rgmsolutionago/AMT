export interface MovieResponse {
    Feature: Feature | Feature[];
}

export interface Feature {
    FeatureId: string;
    Title: string;
    OriginalTitle: string;
    SubTitled: string;
    TotalRuntime: string;
    Rating: string;
    Genre: string;
    PremierDate: string;
    Language: string;
    ShortSynopsis: string;
}