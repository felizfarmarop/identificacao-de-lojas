import { Edit } from "lucide-react";
import { FutureFeaturesModal } from "../FutureFeaturesModal";
import { Button } from "../ui/button";
import { TableCell } from "../ui/table";
import { StoreWithSuggestion } from "../utils";
import { HoverSuggestionCard } from "./HoverSuggestionCard";
import { Store } from "@prisma/client";

type CustomTableProps = {
  stores: StoreWithSuggestion[];
  action: (value: string) => void;
  field: keyof Omit<Store, "id">;
};

const FieldMap = {
  acronym: "Sigla",
  tradeName: "Nome Fantasia",
  companyName: "Razão Social",
  cnpj: "CNPJ",
};

export default function CustomTable(props: CustomTableProps) {
  const [field, fieldDescription] = [props.field, FieldMap[props.field]];

  return props.stores.map((store, index) => {
    const { suggestions, tradeName } = store;
    const fieldValue = store[field];

    const tooltipAction = field === "acronym" ? "print" : "copy";

    return (
      <TableCell key={field + index}>
        <div className="flex items-center space-x-2 group">
          <HoverSuggestionCard
            addToPrintList={props.action}
            suggestions={suggestions}
            action={tooltipAction}
            value={fieldValue}
            field={field}
          />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FutureFeaturesModal
              actionType="edit"
              fieldName={fieldDescription}
              companyName={tradeName}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </FutureFeaturesModal>
          </span>
        </div>
      </TableCell>
    );
  });
}
