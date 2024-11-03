export interface PricesResponse {
    TicketTypes: TicketTypes;
}

export interface TicketTypes {
    TicketType: TicketType | TicketType[];
}

export interface TicketType {
    ID: string;
    Name: string;
    Price: string;
    Zone: string;
    Arrangement: string;

    // Not from WS
    ScheduleID: string;
}