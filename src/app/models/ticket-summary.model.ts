import { TicketResponse } from './ticket-response.model';
import { Show } from './show-response.model';

export class TicketSummary {
    ticketResponse: TicketResponse;
    shows: Show[];

    pID?: number;
    pPickUpCode?: string;
}