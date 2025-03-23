export class CreateEventDTO {
    title: string;
    place: string;
    description: string;
    start: Date;
    end: Date;
    color: string;
    maximumCapacity: number;
    mandatoryEntry: boolean;
    mandatoryExit: boolean;
    autoSubscribeAttributes: string[] | string;
    authorizedAttributes: string[] | string;
}