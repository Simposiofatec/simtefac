export interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    place: string;
    description: string;
    maximumCapacity: number;
    subscriptionCount: number;
    color: string;
    mandatoryEntry: boolean;
    mandatoryExit: boolean;
}