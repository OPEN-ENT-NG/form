import { Folder, CreateFolderPayload, UpdateFolderPayload } from "~/core/models/folder/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { QueryMethod, TagName } from "~/core/enums.ts";
import { toast } from "react-toastify";
import i18n from "~/i18n";
import { FORMULAIRE } from "~/core/constants";

export const folderApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    // Liste des dossiers
    getFolders: builder.query<Folder[], void>({
      query: () => "folders",
      transformResponse: (response: Folder[]) => response,
      providesTags: [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.folderService.list", err);
          toast.error(i18n.t("formulaire.error.folderService.list", { ns: FORMULAIRE }));
        }
      },
    }),

    // Créer un dossier
    createFolder: builder.mutation<Folder, CreateFolderPayload>({
      query: (folder) => ({
        url: "folders",
        method: QueryMethod.POST,
        body: folder,
      }),
      transformResponse: (response: { data: Folder }) => response.data,
      invalidatesTags: [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.folders.create", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.folderService.create", err);
          toast.error(i18n.t("formulaire.error.folderService.create", { ns: FORMULAIRE }));
        }
      },
    }),

    // Mettre à jour un dossier
    updateFolder: builder.mutation<Folder, UpdateFolderPayload>({
      query: (folder) => ({
        url: `folders/${folder.id}`,
        method: QueryMethod.PUT,
        body: folder,
      }),
      transformResponse: (response: { data: Folder }) => response.data,
      invalidatesTags: () => [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.folders.update", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.folderService.update", err);
          toast.error(i18n.t("formulaire.error.folderService.update", { ns: FORMULAIRE }));
        }
      },
    }),

    // Supprimer des dossiers
    deleteFolders: builder.mutation<void, number[]>({
      query: (folderIds) => ({
        url: "folders",
        method: QueryMethod.DELETE,
        body: folderIds,
      }),
      invalidatesTags: [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.folders.delete", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.folderService.delete", err);
          toast.error(i18n.t("formulaire.error.folderService.delete", { ns: FORMULAIRE }));
        }
      },
    }),

    // Déplacer des formulaires vers un dossier
    moveForms: builder.mutation<void, { formIds: number[]; parentId: number }>({
      query: ({ formIds, parentId }) => ({
        url: `folders/${parentId}/move`,
        method: QueryMethod.PUT,
        body: formIds,
      }),
      invalidatesTags: [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(i18n.t("formulaire.success.move", { ns: FORMULAIRE }));
        } catch (err) {
          console.error("formulaire.error.folderService.move", err);
          toast.error(i18n.t("formulaire.error.folderService.move", { ns: FORMULAIRE }));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFoldersMutation,
  useMoveFormsMutation,
} = folderApi;
