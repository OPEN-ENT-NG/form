import { IFolder, ICreateFolderPayload, IUpdateFolderPayload } from "~/core/models/folder/types.ts";
import { emptySplitFormulaireApi } from "./emptySplitFormulaireApi.ts";
import { QueryMethod, TagName } from "~/core/enums.ts";
import { toast } from "react-toastify";
import { t } from "~/i18n";
import { FORMULAIRE_PUBLIC } from "~/core/constants";

export const folderApi = emptySplitFormulaireApi.injectEndpoints({
  endpoints: (builder) => ({
    // Liste des dossiers
    getFolders: builder.query<IFolder[], void>({
      query: () => "folders",
      transformResponse: (response: IFolder[]) => response,
      providesTags: [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("formulaire.error.folderService.list", err);
          toast.error(t("formulaire.error.folderService.list", { ns: FORMULAIRE_PUBLIC }));
        }
      },
    }),

    // Créer un dossier
    createFolder: builder.mutation<IFolder, ICreateFolderPayload>({
      query: (folder) => ({
        url: "folders",
        method: QueryMethod.POST,
        body: folder,
      }),
      transformResponse: (response: { data: IFolder }) => response.data,
      invalidatesTags: [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.folders.create", { ns: FORMULAIRE_PUBLIC }));
        } catch (err) {
          console.error("formulaire.error.folderService.create", err);
          toast.error(t("formulaire.error.folderService.create", { ns: FORMULAIRE_PUBLIC }));
        }
      },
    }),

    // Mettre à jour un dossier
    updateFolder: builder.mutation<IFolder, IUpdateFolderPayload>({
      query: (folder) => ({
        url: `folders/${folder.id.toString()}`,
        method: QueryMethod.PUT,
        body: folder,
      }),
      transformResponse: (response: { data: IFolder }) => response.data,
      invalidatesTags: () => [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.folders.update", { ns: FORMULAIRE_PUBLIC }));
        } catch (err) {
          console.error("formulaire.error.folderService.update", err);
          toast.error(t("formulaire.error.folderService.update", { ns: FORMULAIRE_PUBLIC }));
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
          toast.success(t("formulaire.success.folders.delete", { ns: FORMULAIRE_PUBLIC }));
        } catch (err) {
          console.error("formulaire.error.folderService.delete", err);
          toast.error(t("formulaire.error.folderService.delete", { ns: FORMULAIRE_PUBLIC }));
        }
      },
    }),

    // Déplacer des dossiers vers un dossier
    moveFolders: builder.mutation<void, { folderIds: number[]; parentId: number }>({
      query: ({ folderIds, parentId }) => ({
        url: `folders/${parentId.toString()}/move`,
        method: QueryMethod.PUT,
        body: JSON.stringify(folderIds),
      }),
      invalidatesTags: [TagName.FOLDERS],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t("formulaire.success.move", { ns: FORMULAIRE_PUBLIC }));
        } catch (err) {
          console.error("formulaire.error.folderService.move", err);
          toast.error(t("formulaire.error.folderService.move", { ns: FORMULAIRE_PUBLIC }));
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
  useMoveFoldersMutation,
} = folderApi;
