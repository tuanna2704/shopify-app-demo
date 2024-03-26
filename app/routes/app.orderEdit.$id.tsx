import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  InlineStack,
  Page,
  Card,
  Tag,
  TextField,
  BlockStack,
  Button,
} from "@shopify/polaris";

export async function loader({
  request,
  params,
}: {
  request: any;
  params: any;
}) {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(`
    {
      order(id: "gid://shopify/Order/${params.id}") {
        id
        tags
        name
        customer {
          id
          displayName
          email
        }
      }
    }`);

  const {
    data: { order },
  } = await response.json();

  return json(order);
}

export default function Edit() {
  const data: { tags: string[], name: string } = useLoaderData();
  const [tags, setTags] = useState<string[]>(data.tags);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handleSaveTag = () => {
    console.log("Save tags", tags);
  }

  return (
    <Page title={`Edit Tag for Order ${data.name}`}>
      <Card>
        <InlineStack wrap={false} gap={"300"}>
          <div>Tag list: </div>
          {tags.map((tag, index) => (
            <Tag key={index} onRemove={() => handleRemoveTag(index)}>
              {tag}
            </Tag>
          ))}
        </InlineStack>

        <BlockStack gap="500">
          <br />
          <TextField
            label="Add Tag For Order:"
            value={tagInput}
            onChange={(value) => setTagInput(value)}
            autoComplete="off"
          />
          <Button onClick={handleAddTag}>Add Tag</Button>
          <Button onClick={handleSaveTag} variant="primary">Save</Button>
        </BlockStack>
      </Card>
    </Page>
  );
}
