import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { default as LinkDef } from "next/link";

export function Link({
  children,
  ...attributes
}: {
  children: any;
  [key: string]: any;
}) {
  const router = useOwnRouter();

  if (attributes.onClick === undefined) {
    attributes.onClick = (e: any) => {
      router.push(attributes.href);
    };
  }

  return (
    <LinkDef href={"#"} {...attributes}>
      {children}
    </LinkDef>
  );
}
