import { Activity } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';

export const useActivityColumns = (
  context: DataTableConfig<Activity>
): ColumnDef<Activity>[] => {

  const { t } = useTranslation('settings');

  return [
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('activity.attributes.label')}
          attribute="label"
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: false
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