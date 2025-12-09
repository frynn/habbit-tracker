import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function SettingsMain() {
  return (
    <div className="pl-2 pr-2 flex flex-col gap-2">
      <Item asChild variant="outline">
        <Link to="ui">
          <ItemContent>
            <ItemTitle>UI-settings</ItemTitle>
            <ItemDescription>
              Here you can change some UI details
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-5" />
          </ItemActions>
        </Link>
      </Item>

      <Item variant="outline" asChild>
        <Link to="system">
          <ItemContent>
            <ItemTitle>System</ItemTitle>
            <ItemDescription>Main system settings</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-5" />
          </ItemActions>
        </Link>
      </Item>

      <Item variant="outline" asChild>
        <Link to="private">
          <ItemContent>
            <ItemTitle>Private</ItemTitle>
            <ItemDescription>Details about private settings</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-5" />
          </ItemActions>
        </Link>
      </Item>
    </div>
  );
}
