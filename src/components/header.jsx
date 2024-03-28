import { Flex } from "@radix-ui/themes";

export default function Header() {
  return (
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="text-2xl font-semibold">Chati</div>
      <Flex align={"center"}>
        <w3m-button />
      </Flex>
    </div>
  );
}
