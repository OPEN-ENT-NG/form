import { Folder, CreateFolderPayload, UpdateFolderPayload } from "~/core/models/folder/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { QueryMethod, TagName } from "~/core/enums.ts";

export const folderApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    // Liste des dossiers
    getFolders: builder.query<Folder[], void>({
      query: () => "folders",
      transformResponse: (response: Folder[]) => response,
      providesTags: [TagName.FOLDERS],
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
        } catch (err) {
          console.error("formulaire.error.folderService.create", err);
          throw new Error("formulaire.error.folderService.create");
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
        } catch (err) {
          console.error("formulaire.error.folderService.update", err);
          throw new Error("formulaire.error.folderService.update");
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
        } catch (err) {
          console.error("formulaire.error.folderService.delete", err);
          throw new Error("formulaire.error.folderService.delete");
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
        } catch (err) {
          console.error("formulaire.error.folderService.move", err);
          throw new Error("formulaire.error.folderService.move");
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
