import { DEMO } from "../configuration";
import {
    getPatients as apiGetPatients,
    getTherapists as apiGetTherapists,
    getBehaviors as apiGetBehaviors,
    getSessionsForPatient as apiGetSessionsForPatient,
    getSession as apiGetSession,
    getPatientBehaviorTrend as apiGetPatientBehaviorTrend
} from "./api";
import {
    getPatients as mockGetPatients,
    getTherapists as mockGetTherapists,
    getBehaviors as mockGetBehaviors,
    getSessionsForPatient as mockGetSessionsForPatient,
    getSession as mockGetSession,
    getPatientBehaviorTrend as mockGetPatientBehaviorTrend,
} from "./mockApi";

let getPatients = apiGetPatients;
let getTherapists = apiGetTherapists;
let getBehaviors = apiGetBehaviors;
let getSessionsForPatient = apiGetSessionsForPatient;
let getSession = apiGetSession;
let getPatientBehaviorTrend = apiGetPatientBehaviorTrend;


if (DEMO) {
    getPatients = mockGetPatients;
    getTherapists = mockGetTherapists;
    getBehaviors = mockGetBehaviors;
    getSessionsForPatient = mockGetSessionsForPatient;
    getSession = mockGetSession;
    getPatientBehaviorTrend = mockGetPatientBehaviorTrend;
}

export {
    getPatients,
    getTherapists,
    getBehaviors,
    getSessionsForPatient,
    getSession,
    getPatientBehaviorTrend,
};
