import http from "../http-common";
import { AzureBlobService } from './AzureBlobService';

class CodeForACauseService {

    getTherapist() {
        return http.get('/therapist');
    }

    getDevices() {
        return http.get('/devices');
    }

    getTherapist(id) {
        return http.get('/therapist${id}');
    }

    getDevices(id) {
        return http.get('/devices');
    }

    saveDeviceConfig(data) {
        console.log(data);
        var fileName = data.DeviceId + '_' + new Date().getTime() + '.json';
        var file = new File([data], fileName , {type: 'application/json'});
        var azureBlobService = new AzureBlobService();
        azureBlobService.uploadToBlobStorage(file, {
            filename: fileName
          });
        return 'success';
    }

    getTherapistSessions(id) {
        return http.get('/therapist/${id}/sessions');
    }
}

export default new CodeForACauseService();