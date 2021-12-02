export interface Member {
    firstName: string;
    lastName: string;
    jobTitle: string;
    team: string;
    status: string;
}

export interface RouterParams {
    action: string;
    member?: Member;
}
