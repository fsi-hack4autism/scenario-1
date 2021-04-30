import { TransferProgressEvent } from '@azure/core-http';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { from, Observable, Subscriber } from 'rxjs';
import { distinctUntilChanged, scan, startWith } from 'rxjs/operators';
import {
    BlobContainerRequest,
    BlobFileRequest,
    BlobStorageRequest
} from './azure-storage';

export class AzureBlobService {

    public uploadToBlobStorage(file: File, request: BlobFileRequest) {
        const blockBlobClient = this.getBlockBlobClient(request);
        console.log(blockBlobClient);
        return this.uploadFile(blockBlobClient, file);
    }

    getBlockBlobClient(request: BlobFileRequest) {
        const containerClient = this.getContainerClient(request);
        return containerClient.getBlockBlobClient(request.filename);
    }

    getContainerClient(request: BlobContainerRequest) {
        const blobServiceClient = this.buildClient(request);
        request.containerName = 'referencedata';
        return blobServiceClient.getContainerClient(request.containerName);
    }

    uploadFile(blockBlobClient: BlockBlobClient, file: File) {
        return new Observable<number>(observer => {
            blockBlobClient
                .uploadBrowserData(file, {
                    onProgress: this.onProgress(observer),
                    blobHTTPHeaders: {
                        blobContentType: file.type
                    }
                })
                .then(
                    this.onUploadComplete(observer, file),
                    this.onUploadError(observer)
                );
        }).pipe(distinctUntilChanged());
    }

    buildClient(options: BlobStorageRequest) {
        return BlobServiceClient.fromConnectionString(
            this.buildConnectionString(options)
        );
    }

    buildConnectionString = (options: BlobStorageRequest) => {
        return (
            'BlobEndpoint=https://iotaut2020.blob.core.windows.net/;' +
            'SharedAccessSignature=?sv=2019-10-10&ss=b&srt=sco&sp=rwdlacx&se=2020-06-01T03:04:04Z&st=2020-05-22T19:04:04Z&spr=https&sig=MgaK%2FUMavXqomgf%2FtLWpOVH75yqZkpvuOwCoxhR%2FCZU%3D'
        );
    };

    onUploadError(observer: Subscriber<number>) {
        console.log('in error');
        return (error: any) => observer.error(error);
    }

    onUploadComplete(observer: Subscriber<number>, file: File) {
        return () => {
            console.log('upload finsihed');
            observer.next(file.size);
            observer.complete();
        };
    }

    onProgress(observer: Subscriber<number>) {
        return (progress: TransferProgressEvent) =>
            observer.next(progress.loadedBytes);
    }

}