export class Candidate {
    candidateId: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: Date;
    panNo: string;
    phone: bigint;
    address: string;
    status: boolean | null;
    resumeId: bigint;

    constructor(
        candidateId: string,
        firstName: string,
        lastName: string,
        email: string,
        dob: Date,
        panNo: string,
        phone: bigint,
        address: string,
        status: boolean | null,
        resumeId: bigint
      ) {
        this.candidateId = candidateId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.panNo = panNo;
        this.phone = phone;
        this.address = address;
        this.status = status;
        this.resumeId = resumeId;
      }
}
