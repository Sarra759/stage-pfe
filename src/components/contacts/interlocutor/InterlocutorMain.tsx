import React from 'react';
import { api } from '@/api';
import { CreateInterlocutorDto, Interlocutor, UpdateInterlocutorDto } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useInterlocutorDeleteDialog } from './modals/InterlocutorDeleteDialog';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useInterlocutorManager } from './hooks/useInterlocutorManager';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useInterlocutorCreateOrAssociateSheet } from './modals/InterlocutorCreateOrAssociateSheet';
import { useInterlocutorUpdateSheet } from './modals/InterlocutorUpdateSheet';
import { useInterlocutorPromoteDialog } from './modals/InterlocutorPromoteDialog';
import { useInterlocutorDisassociateDialog } from './modals/InterlocutorDisassociateDialog';
import { useIntro } from '@/context/IntroContext';

import { useInterlocutorColumns } from './columns';

import { cn } from '@/lib/utils';
interface InterlocutorProps {
  className?: string;
  firmId?: number;
}
export const InterlocutorMain: React.FC<InterlocutorProps> = ({ className, firmId }) => {
const router = useRouter();
const { t: tCommon } = useTranslation('common');
const { t: tContacts } = useTranslation('contacts');
const { setIntro, clearIntro } = useIntro();

const { setRoutes , clearRoutes} = useBreadcrumb();
React.useEffect(() => {
  setIntro?.(
    tContacts('interlocutor.singular'),
    tContacts('interlocutor.card_description')
  );

  setRoutes?.([
    { title: tCommon('menu.contacts'), href: '/contacts' },
    { title: tCommon('submenu.interlocutors') }
  ]);

  return () => {
    clearIntro?.();
    clearRoutes?.();
  };
}, [tCommon, tContacts]);
  const interlocutorManager = useInterlocutorManager();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    isPending: isFetchPending,
    error,
    data: interlocutorsResp,
    refetch: refetchInterloctors
  } = useQuery({
    queryKey: [
      'interlocutors',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      firmId
    ],
    queryFn: () =>
      api.interlocutor.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        firmId
      )
  });

  const interlocutors = React.useMemo(() => {
    //sort interlocutors by main field
    return interlocutorsResp?.data || [];
  }, [interlocutorsResp]);

  //associate interlocutor
  const { mutate: associateInterlocutor, isPending: isAssociatePending } = useMutation({
    mutationFn: (interlocutorId?: number) =>
      api.firmInterlocutorEntry.create({
        firmId,
        position: interlocutorManager.position,
        interlocutorId: interlocutorId
      }),
    onSuccess: () => {
      refetchInterloctors();
      toast.success(tContacts('interlocutor.action_associate_success'));
      interlocutorManager.reset();
    },
    onError: () => {
      toast.error(tContacts('interlocutor.action_associate_error'));
    }
  });

  const { mutate: disassociateInterlocutor, isPending: isDisassociatePending } = useMutation({
    mutationFn: (id?: number) => api.firmInterlocutorEntry.remove(firmId, id),
    onSuccess: () => {
      refetchInterloctors();
      toast.success(tContacts('interlocutor.action_disassociate_success'));
    },
    onError: () => {
      toast.error(tContacts('interlocutor.action_disassociate_error'));
    }
  });

  //promote interlocutor
  const { mutate: promoteInterlocutor, isPending: isPromotionPending } = useMutation({
    mutationFn: (id?: number) => api.interlocutor.promote(id, firmId),
    onSuccess: () => {
      refetchInterloctors();
      toast.success(tContacts('interlocutor.action_promote_success'));
    },
    onError: (error): void => {
      const message = getErrorMessage(
        'contacts',
        error,
        tContacts('interlocutor.action_promote_failure')
      );
      toast.error(message);
    }
  });

  //create interlocutor
  const { mutate: createInterlocutor, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateInterlocutorDto) => api.interlocutor.create(data),
    onSuccess: (data) => {
      associateInterlocutor(data.id);
      toast.success(tContacts('interlocutor.action_add_success'));
    },
    onError: (error): void => {
      const message = getErrorMessage(
        'contacts',
        error,
        tContacts('interlocutor.action_add_failure')
      );
      toast.error(message);
    }
  });

  //update interlocutor
  const { mutate: updateInterlocutor, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateInterlocutorDto) => api.interlocutor.update(data),
    onSuccess: (data) => {
      associateInterlocutor(data.id);
      toast.success(tContacts('interlocutor.action_update_success'));
    },
    onError: (error): void => {
      const message = getErrorMessage(
        'contacts',
        error,
        tContacts('interlocutor.action_update_failure')
      );
      toast.error(message);
    }
  });

  //remove interlocutor
  const { mutate: removeInterlocutor, isPending: isDeletePending } = useMutation({
    mutationFn: (id?: number) => api.interlocutor.remove(id),
    onSuccess: () => {
      if (interlocutors?.length == 1 && page > 1) setPage(page - 1);
      interlocutorManager.reset();
      refetchInterloctors();
      toast.success(tContacts('interlocutor.action_remove_success'));
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_remove_failure'))
      );
    }
  });

  //handle interlocutor update
  const handleUpdateSubmit = () => {
    const data: UpdateInterlocutorDto = interlocutorManager.getInterlocutor();
    const validation = api.interlocutor.validate(data);
    if (validation.message) toast.error(validation.message);
    else {
      updateInterlocutor(data);
      closeUpdateInterlocutorSheet();
    }
  };
  const { updateInterlocutorSheet, openUpdateInterlocutorSheet, closeUpdateInterlocutorSheet } =
    useInterlocutorUpdateSheet(
      firmId,
      handleUpdateSubmit,
      isUpdatePending,
      interlocutorManager.reset
    );

  //handle interlocutor creation
  const handleCreateSubmit = () => {
    const data: CreateInterlocutorDto = interlocutorManager.getInterlocutor();
    const validation = api.interlocutor.validate(data);
    if (validation.message) toast.error(validation.message);
    else {
      createInterlocutor(data);
      closeCreateInterlocutorSheet();
    }
  };

  const handleAssociateSubmit = () => {
    const validation = api.interlocutor.validateAssociations(
      interlocutorManager?.id,
      interlocutorManager?.position
    );
    if (validation.message) toast.error(validation.message);
    else {
      associateInterlocutor(interlocutorManager?.id);
      closeCreateInterlocutorSheet();
    }
  };

  const { createInterlocutorSheet, openCreateInterlocutorSheet, closeCreateInterlocutorSheet } =
    useInterlocutorCreateOrAssociateSheet(
      firmId,
      handleCreateSubmit,
      handleAssociateSubmit,
      isCreatePending || isAssociatePending,
      interlocutorManager.reset
    );

  const { deleteInterlocutorDialog, openDeleteInterlocutorDialog } = useInterlocutorDeleteDialog(
    `${interlocutorManager.name} ${interlocutorManager.surname}`,
    () => removeInterlocutor(interlocutorManager.id),
    isCreatePending
  );

  const { promoteInterlocutorDialog, openPromoteInterlocutorDialog } = useInterlocutorPromoteDialog(
    `${interlocutorManager.name} ${interlocutorManager.surname}`,
    () => promoteInterlocutor(interlocutorManager.id),
    isCreatePending
  );

  const { disassociateInterlocutorDialog, openDisassociateInterlocutorDialog } =
    useInterlocutorDisassociateDialog(
      `${interlocutorManager.name} ${interlocutorManager.surname}`,
      (id?: number) => disassociateInterlocutor(id),
      isDisassociatePending
    );



    const context: DataTableConfig<Interlocutor> = {
  singularName: tContacts('interlocutor.singular'),
  pluralName: tContacts('interlocutor.plural'),

  inspectCallback: () => {},

  createCallback: () => {
    openCreateInterlocutorSheet();
  },

  updateCallback: () => {
    openUpdateInterlocutorSheet();
  },

  deleteCallback: () => {
    openDeleteInterlocutorDialog();
  },

  additionalActions: {},

  searchTerm,
  setSearchTerm,

  page,
  totalPageCount: interlocutorsResp?.meta.pageCount || 1,
  setPage,

  size,
  setSize,

  order: sortDetails.order,
  sortKey: sortDetails.sortKey,

  setSortDetails: (order: boolean, sortKey: string) =>
    setSortDetails({ order, sortKey }),

  targetEntity: (interlocutor: Interlocutor) => {
    interlocutorManager.set('id', interlocutor.id);
  }
};
  
const columns = useInterlocutorColumns(context);
  const isPending =
    isFetchPending ||
    isAssociatePending ||
    isDisassociatePending ||
    isPromotionPending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (error) return 'An error has occurred: ' + error.message;
 return (
  <div className={cn('flex flex-col flex-1 overflow-hidden container mx-auto', className)}>
    {createInterlocutorSheet}
    {updateInterlocutorSheet}
    {deleteInterlocutorDialog}
    {promoteInterlocutorDialog}
    {disassociateInterlocutorDialog}

    <DataTable
      className="flex flex-col flex-1 overflow-auto p-1"
      containerClassName="overflow-auto"
      data={interlocutors}
      columns={columns}
      context={context}
      isPending={isPending}
    />
  </div>
);
};
