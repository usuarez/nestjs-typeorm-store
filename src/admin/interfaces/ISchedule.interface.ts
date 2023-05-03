export interface ISchedule {
  monday: IDaySchedule;
  tuesday: IDaySchedule;
  wednesday: IDaySchedule;
  thursday: IDaySchedule;
  friday: IDaySchedule;
  saturday: IDaySchedule;
  sunday: IDaySchedule;
}

interface IDaySchedule {
  open: string;
  close: string;
  breakEnds?: string;
  breakStart?: string;
}
