import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
}

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  columns: Column[];
  data: Record<string, unknown>[];
  emptyMessage?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, columns, data, emptyMessage = 'Nenhum registro encontrado', ...props }, ref) => {
    return (
      <div className="overflow-x-auto rounded-xl border border-dark-800">
        <table ref={ref} className={clsx('w-full border-collapse', className)} {...props}>
          <thead>
            <tr className="bg-dark-900/50 border-b border-dark-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider',
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-dark-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-dark-800/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        'px-4 py-3 text-sm text-dark-300',
                        col.className
                      )}
                    >
                      {row[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

// Pagination component
export interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, total, pageSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-dark-800">
      <span className="text-sm text-dark-500">
        Página {page + 1} de {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="px-3 py-1.5 text-sm bg-dark-800 hover:bg-dark-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-3 py-1.5 text-sm bg-dark-800 hover:bg-dark-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};