import { Feature } from './movie-response.model';

export interface ShowResponse {
    Show: Show | Show[];
}

export interface Show {
    TheatreId: string;
    ScheduleId: string;
    FeatureId: string;
    StartTime: string;
    Performance: string;
    Status: any;
    Preview: string;
    Seats: string;
    Distribution: string;
    Habilitadas: string;
    ScreenID: string;
    ScreenName: string;
    TechnologyID: string;
    TechnologyName: string;
    ScreenTypeID: string;
    ScreenType: string;

    // Currently loaded in code and not from response
    Feature?: Feature;
}