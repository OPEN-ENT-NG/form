package fr.openent.formulaire.helpers.upload_file;

import io.vertx.core.*;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.storage.Storage;
import org.entcore.common.utils.FileUtils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class FileHelper {
    private static final Logger log = LoggerFactory.getLogger(FileHelper.class);

    private FileHelper() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * This method will fetch all uploaded files from your {@link HttpServerRequest} request and upload them into your
     * storage and return each of them an object {@link Attachment}
     *
     * @param nbFilesToUpload   the total number of files expected to be uploaded
     * @param request       request HttpServerRequest
     * @param storage       Storage vertx
     * @param vertx    Vertx vertx (unused but kept for compatibility)
     *
     * @return list of {@link Attachment} (and all your files will be uploaded)
     * (process will continue in background to stream all these files in your storage)
     */
    public static Future<List<Attachment>> uploadMultipleFiles(int nbFilesToUpload, HttpServerRequest request, Storage storage, Vertx vertx) {
        Promise<List<Attachment>> promise = Promise.promise();
        AtomicBoolean responseSent = new AtomicBoolean(false);

        // Return empty arrayList if no header is sent (meaning no files to upload)
        if (nbFilesToUpload == 0) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        AtomicInteger incrementFile = new AtomicInteger(0);
        List<Attachment> listMetadata = new ArrayList<>();

        // Enable multipart handling
        request.setExpectMultipart(true);

        // We define the exception handler
        request.exceptionHandler(event -> {
            log.error("[Formulaire@uploadMultipleFiles] An error has occurred during http request process : " + event.getMessage());
            promise.fail(event.getMessage());
        });

        request.uploadHandler(upload -> {
            // Generate unique filename for temporary storage
            String tempFileName;
            try {
                tempFileName = File.createTempFile("form_", null).getAbsolutePath();
            } catch (IOException e) {
                log.error("[Formulaire@uploadMultipleFiles] Failed to create temporary file: " + e.getMessage());
                promise.fail(e.getMessage());
                return;
            }
            final JsonObject metadata = FileUtils.metadata(upload);

            // Save upload to temporary file first
            upload.streamToFileSystem(tempFileName)
                .onSuccess(e -> {
                    // Now upload the temporary file to Storage
                    storage.writeFsFile(tempFileName, result -> {
                        if (!"ok".equals(result.getString("status"))) {
                            log.error("[Formulaire@uploadMultipleFiles] Failed to upload file to storage: " + result.getString("message"));
                            
                            // Clean up temporary file
                            vertx.fileSystem().delete(tempFileName, deleteResult -> {});
                            promise.fail("Failed to upload file: " + result.getString("message"));
                            return;
                        }

                        String fileId = result.getString("_id");
                        listMetadata.add(new Attachment(fileId, new Metadata(metadata)));
                        incrementFile.incrementAndGet();

                        // Clean up temporary file
                        vertx.fileSystem().delete(tempFileName, deleteResult -> {
                            if (deleteResult.failed()) {
                                log.warn("[Formulaire@uploadMultipleFiles] Failed to delete temp file: " + tempFileName);
                            }
                        });

                        if (incrementFile.get() == nbFilesToUpload && responseSent.compareAndSet(false, true)) {
                            for (Attachment at : listMetadata) {
                                log.info(at.id());
                            }
                            promise.complete(listMetadata);
                        }
                    });
                })
                .onFailure(th -> {
                    log.error("[Formulaire@uploadMultipleFiles] Failed to save temp file: " + th.getMessage());
                    promise.fail(th.getMessage());
                });
        });

        return promise.future();
    }

}
