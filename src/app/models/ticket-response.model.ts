import { TicketType } from './prices-response.model';
import { Show } from './show-response.model';

export interface TicketResponse {
    Ticket: Ticket | Ticket[];
    Tickets: any | any[];
    Concessions: any | any[];
    Error?: TicketError;
    shows: Show[];
}
interface TicketError {
    Message: string;
}

export interface Ticket {
    Amount: string;
    PrintStringTicket: string;
    ScheduleID: string;
    ShowTimeDate: string;
    TicketNumber: string;

    // Currently loaded in code and not from response
    TicketType: TicketType;
}