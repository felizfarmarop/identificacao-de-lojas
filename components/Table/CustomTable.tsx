import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { TableCell } from "../ui/table";
import { StoreWithSuggestion } from "../utils";
import { HoverSuggestionCard } from "./HoverSuggestionCard";
import { Store } from "@prisma/client";
import { SuggestionModal } from "../SuggestionModal";

type CustomTableProps = {
  stores: StoreWithSuggestion[];
  action: (value: string) => void;
  updateList: () => void;
  field: keyof Omit<Store, "id">;
};

export const FieldMap = {
  acronym: "Sigla",
  tradeName: "Nome Fantasia",
  companyName: "Razão Social",
  cnpj: "CNPJ",
};

export default function CustomTable(props: CustomTableProps) {
  const [field, fieldDescription] = [props.field, FieldMap[props.field]];

  return props.stores.map((store, index) => {
    const { suggestions, id } = store;

    const fieldValue = store[field];
    const tooltipAction = field === "acronym" ? "print" : "copy";

    return (
      <TableCell key={field + index}>
        <div className="flex items-center space-x-2 group">
          <HoverSuggestionCard
            execute={props.action}
            updateList={props.updateList}
            suggestions={suggestions}
            action={tooltipAction}
            value={fieldValue}
            field={field}
          />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <SuggestionModal
              storeId={id}
              field={field}
              fieldPlaceholder={fieldDescription}
              currentValue={fieldValue}
              updateList={props.updateList}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </SuggestionModal>
          </span>
        </div>
      </TableCell>
    );
  });
}
