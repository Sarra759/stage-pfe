import { Interlocutor } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { transformDateTime } from '@/utils/date.utils';
import { INTERLOCUTOR_FILTER_ATTRIBUTES } from '@/constants/interlocutor.filter-attributes';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export const useInterlocutorColumns = (
  context: DataTableConfig<Interlocutor>
): ColumnDef<Interlocutor>[] => {

  const { t } = useTranslation('contacts');
  const { t: tCommon } = useTranslation('common');

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.attributes.name')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.NAME}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'surname',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.attributes.surname')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.SURNAME}
        />
      ),
      cell: ({ row }) => <div>{row.original.surname}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.attributes.email')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.EMAIL}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">{row.original.email}</div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.attributes.phone')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.PHONE}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.phone || (
            <span className="text-zinc-400">
              {t('interlocutor.empty_cells.phone')}
            </span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.attributes.created_at')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.CREATEDAT}
        />
      ),
      cell: ({ row }) => (
        <div>{transformDateTime(row.original?.createdAt || '')}</div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} context={context} />
        </div>
      )
    }
  ];
};