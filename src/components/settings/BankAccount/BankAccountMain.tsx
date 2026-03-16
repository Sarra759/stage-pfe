import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BankAccount, CreateBankAccountDto, UpdateBankAccountDto } from '@/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useBankAccountManager } from './hooks/useBankAccountManager';
import { BankAccountCreateDialog } from './dialogs/BankAccountCreateDialog';
import { BankAccountUpdateDialog } from './dialogs/BankAccountUpdateDialog';
import { BankAccountDeleteDialog } from './dialogs/BankAccountDeleteDialog';
import { BankAccountPromoteDialog } from './dialogs/BankAccountPromoteDialog';
import { DataTable } from '@/components/shared/data-table/data-table';
import { getBankAccountColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';
import ContentSection from '@/components/shared/ContentSection';
import { cn } from '@/lib/utils';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import { api } from '@/api';

interface BankAccountMainProps {
  className?: string;
}

export const BankAccountMain: React.FC<BankAccountMainProps> = ({ className }) => {
  //next-router
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { t: tCurrency } = useTranslation('currency');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.account') },
      { title: tCommon('settings.account.bank_accounts') }
    ]);
  }, [router.locale]);

  const bankAccountManager = useBankAccountManager();

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

  const [createDialog, setCreateDialog] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [promoteDialog, setPromoteDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: bankAccountsResp,
    refetch: refetchBankAccounts
  } = useQuery({
    queryKey: [
      'bank-accounts',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.bankAccount.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const bankAccounts = React.useMemo(() => {
    return bankAccountsResp?.data || [];
  }, [bankAccountsResp]);


  const context: DataTableConfig<BankAccount> = {
  singularName: tSettings('bank_account.singular'),
  pluralName: tSettings('bank_account.plural'),

  createCallback: () => setCreateDialog(true),
  updateCallback: () => setUpdateDialog(true),
  deleteCallback: () => setDeleteDialog(true),

 
  searchTerm,
  setSearchTerm,

  page,
  totalPageCount: bankAccountsResp?.meta.pageCount || 1,
  setPage,

  size,
  setSize,

  order: sortDetails.order,
  sortKey: sortDetails.sortKey,

  setSortDetails: (order: boolean, sortKey: string) =>
    setSortDetails({ order, sortKey }),

 targetEntity: (bankAccount: BankAccount) => {
  bankAccountManager.set('id', bankAccount.id);
  bankAccountManager.set('name', bankAccount.name);
  bankAccountManager.set('bic', bankAccount.bic);
  bankAccountManager.set('rib', bankAccount.rib);
  bankAccountManager.set('iban', bankAccount.iban);
  bankAccountManager.set('currency', bankAccount.currency);
  bankAccountManager.set('isMain', bankAccount.isMain);
}
};
  // determine if there are bank accounts available so we let the client decide to switch its main account
  const [hasToCreateMainByDefault, setHasToCreateMainByDefault] = React.useState<boolean>(false);
  const [hasToUpdateMainByDefault, setHasToUpdateMainByDefault] = React.useState<boolean>(false);
  React.useEffect(() => {
    const fetchInitialAccounts = async () => {
      const resp = await api.bankAccount.findPaginated();
      setHasToCreateMainByDefault(resp.data.length === 0);
      setHasToUpdateMainByDefault(resp.data.length === 1);
    };
    fetchInitialAccounts();
  }, [bankAccounts]);

  //create bank account
  const { mutate: createBankAccount, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateBankAccountDto) => api.bankAccount.create(data),
    onSuccess: () => {
      toast.success(tSettings('bank_account.action_add_success'));
      refetchBankAccounts();
      bankAccountManager.reset();
      setCreateDialog(false);
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'bank_account.action_add_failure');
      toast.error(message);
    }
  });

  //update bank account
  const { mutate: updateBankAccount, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateBankAccountDto) => api.bankAccount.update(data),
    onSuccess: () => {
      toast.success(tSettings('bank_account.action_add_success'));
      refetchBankAccounts();
      bankAccountManager.reset();
      setUpdateDialog(false);
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'bank_account.action_add_failure');
      toast.error(message);
    }
  });

  //remove bank account
  const { mutate: removeBankAccount, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.bankAccount.remove(id),
    onSuccess: () => {
      if (bankAccounts?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tSettings('bank_account.action_remove_success'));
      refetchBankAccounts();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('settings', error, 'bank_account.action_remove_failure'));
    }
  });

  //promote bank account
  const { mutate: promoteBankAccount, isPending: isPromotionPending } = useMutation({
    mutationFn: (data: BankAccount) => api.bankAccount.update({ ...data, isMain: true }),
    onSuccess: (data) => {
      toast.success(tSettings('bank_account.action_promote_success', { name: data.name }));
      refetchBankAccounts();
      bankAccountManager.reset();
      setPromoteDialog(false);
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'bank_account.action_promote_success');
      toast.error(message);
    }
  });

  const handleBankAccountCreateSubmit = () => {
    if (hasToCreateMainByDefault) bankAccountManager.set('isMain', true);
    const bankAccount = bankAccountManager.getBankAccount();
    const validation = api.bankAccount.validate(bankAccount);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      createBankAccount(bankAccount);
    }
  };

  const handleBankAccountUpdateSubmit = () => {
    const bankAccount = bankAccountManager.getBankAccount();
    const validation = api.bankAccount.validate(bankAccount, hasToUpdateMainByDefault);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      updateBankAccount(bankAccount);
    }
  };
const columns = getBankAccountColumns(context, tSettings, tCurrency);
  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (error) return 'An error has occurred: ' + error.message;
 return (
  <ContentSection title={''} desc={''}>
  <div>
    <DataTable
      className="flex flex-col flex-1 overflow-hidden p-1"
      containerClassName="overflow-auto"
      data={bankAccounts}
      columns={columns}
      context={context}
      isPending={isPending}
    />

    <BankAccountCreateDialog
  open={createDialog}
  createBankAccount={handleBankAccountCreateSubmit}
  isCreatePending={isCreatePending}
  onClose={() => setCreateDialog(false)}
  mainByDefault={hasToCreateMainByDefault}
/>

   <BankAccountUpdateDialog
  open={updateDialog}
  updateBankAccount={handleBankAccountUpdateSubmit}
  isUpdatePending={isUpdatePending}
  onClose={() => setUpdateDialog(false)}
/>

  <BankAccountDeleteDialog
  open={deleteDialog}
  deleteBankAccount={() =>
    removeBankAccount(bankAccountManager.getBankAccount().id!)
  }
  isDeletionPending={isDeletePending}
  onClose={() => setDeleteDialog(false)}
/>
   <BankAccountPromoteDialog
  open={promoteDialog}
  promoteBankAccount={() =>
    promoteBankAccount(bankAccountManager.getBankAccount())
  }
  isPromotingPending={isPromotionPending}
  onClose={() => setPromoteDialog(false)}
/>
  </div>
</ContentSection>

  );
};
