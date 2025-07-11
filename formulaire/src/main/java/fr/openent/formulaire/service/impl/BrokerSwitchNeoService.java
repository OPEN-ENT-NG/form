package fr.openent.formulaire.service.impl;

import fr.openent.formulaire.service.NeoService;
import fr.wseduc.webutils.Either;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.broker.api.dto.directory.*;
import org.entcore.common.migration.AppMigrationConfiguration;
import org.entcore.common.migration.BrokerSwitchConfiguration;
import org.entcore.common.utils.CollectionUtils;
import org.entcore.common.utils.StringUtils;

import java.util.stream.Collectors;

import static org.entcore.common.utils.CollectionUtils.toSet;

public class BrokerSwitchNeoService implements NeoService {
  private final EventBus eventBus;
  private final NeoService neoService;
  private final AppMigrationConfiguration appMigrationConfiguration;

  public BrokerSwitchNeoService(final EventBus eventBus,
                                final NeoService neoService,
                                final AppMigrationConfiguration appMigrationConfiguration) {
    this.eventBus = eventBus;
    this.neoService = neoService;
    this.appMigrationConfiguration = appMigrationConfiguration;
  }

  @Override
  public void getUsers(JsonArray usersIds, Handler<Either<String, JsonArray>> handler) {
    if(appMigrationConfiguration.isReadEnabled("form.getUsers")) {
      final GetUsersByIdsRequestDTO request = new GetUsersByIdsRequestDTO(usersIds.stream().map(s -> (String)s).collect(Collectors.toList()));
      sendToBroker("form.getUsers", request, GetUsersByIdsResponseDTO.class)
        .onSuccess(response -> {
          handler.handle(new Either.Right<>(response.getUsers().stream().map(JsonObject::mapFrom).collect(CollectionUtils.toJsonArray())));
        })
        .onFailure(th -> new Either.Left<>(th.getMessage()));
    } else {
      neoService.getUsers(usersIds, handler);
    }
  }

  @Override
  public void getGroups(JsonArray groupsIds, Handler<Either<String, JsonArray>> handler) {
    if(appMigrationConfiguration.isReadEnabled("form.getGroups")) {
      final GetGroupsRequestDTO request = new GetGroupsRequestDTO(groupsIds.stream().map(s -> (String)s).collect(Collectors.toSet()));
      sendToBroker("form.getUsers", request, GetGroupsResponseDTO.class)
        .onSuccess(response -> {
          handler.handle(new Either.Right<>(response.getGroups().stream().map(JsonObject::mapFrom).collect(CollectionUtils.toJsonArray())));
        })
        .onFailure(th -> new Either.Left<>(th.getMessage()));
    } else {
      neoService.getGroups(groupsIds, handler);
    }
  }

  @Override
  public void getSharedBookMark(JsonArray bookmarksIds, Handler<Either<String, JsonArray>> handler) {
    neoService.getSharedBookMark(bookmarksIds, handler);
  }

  @Override
  public void getSharedBookMarkUsers(JsonArray bookmarksIds, Handler<Either<String, JsonArray>> handler) {
    neoService.getSharedBookMarkUsers(bookmarksIds, handler);
  }

  @Override
  public void getIdsFromBookMarks(JsonArray bookmarksIds, Handler<Either<String, JsonArray>> handler) {
    neoService.getIdsFromBookMarks(bookmarksIds, handler);
  }

  @Override
  public void getUsersInfosFromIds(JsonArray userIds, JsonArray groupIds, Handler<Either<String, JsonArray>> handler) {
    if(appMigrationConfiguration.isReadEnabled("form.getUsersInfosFromIds")) {
      final GetUserInfoRequestDTO request = new GetUserInfoRequestDTO(
        toSet(userIds, String.class), toSet(groupIds, String.class));
      sendToBroker("form.getUsers", request, GetUserInfoResponseDTO.class)
        .onSuccess(response -> {
          handler.handle(new Either.Right<>(response.getInfo().stream().map(JsonObject::mapFrom).collect(CollectionUtils.toJsonArray())));
        })
        .onFailure(th -> new Either.Left<>(th.getMessage()));
    } else {
      neoService.getUsersInfosFromIds(userIds, groupIds, handler);
    }
  }

  private <T> Future<T> sendToBroker(String action, Object request, Class<T> responseType) {
    final Promise<T> promise = Promise.promise();
    final JsonObject payload = new JsonObject()
      .put("action", action)
      .put("service", "communication")
      .put("params", JsonObject.mapFrom(request));
    eventBus.request(BrokerSwitchConfiguration.LEGACY_MIGRATION_ADDRESS, payload, reply -> {
      if (reply.succeeded()) {
        promise.tryComplete(StringUtils.parseJson((String) reply.result().body(), responseType));
      } else {
        promise.tryFail(reply.cause());
      }
    });
    return promise.future();
  }
}
