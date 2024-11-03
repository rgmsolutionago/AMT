
export interface Show {
    TheatreId: string;
    ScheduleId: string;
    FeatureId: string;
    StartTime: string;
    Performance: string;
    Status: string;
    Preview: string;
    Seats: string;
    Distribution: string;
    Habilitadas: string;
    ScheduleDate: string;
    ScreenName: string;
    TechnologyID: string;
    TechnologyName: string;
    ScreenID: string;
    Screen: string;
    date: string;
    parsedDate: string;
}

export interface SelectedMovie {
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
    poster: string;
}


export interface Category {
    ID: string;
    Name: string;
    Price: string;
    Zone: string;
    Arrangement: string;
    Fee: string;
    quantity: number;
}

export interface SeatItem {
    SeatNumber: string;
    X: string;
    Y: string;
    Status: string;
    SeatType: number;
}

export interface Seats {
    Seat: SeatItem[];
}

export interface Zone {
    ID: string;
    Name: string;
    Numbered: string;
    Color: string;
    DefaultSales: string;
    SeatsSize: string;
    Available: string;
    Sold: string;
    Seats: Seats;
}

export interface Zones {
    Zone: Zone;
}

export interface Distribution {
    ID: string;
    ScreenID: string;
    Zones: Zones;
}

export interface Product {
	CodProducto: string;
	NomProducto: string;
	TipoProducto: string;
	CodMultiCombo: string;
	ImpPreciosXProducto: string;
	image: string;
	quantity: number;
    DescripcionExtra: string;
}


export interface PendingOrder {
    show: Show;
    selectedMovie: SelectedMovie;
    level: number;
    FeatureId: string;
    date: number;
    total: number;
    products: Product[];
    categories: Category[];
    selectedSeats: string[];
    distribution: Distribution;
    paymentMethod: number;
    creditCardCSID: number;
    selectedFeature: any; //TODO: Improve this.
    clientName: string;
    clientDocument: string;
}

