import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
} from "react-router";

export async function loader() {
  console.log("hello from loader");
  return { message: "Hello world" };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = request.formData();
  console.log("hello from action");

  return (await formData).get("name");
}

const Hello = () => {
  const { message } = useLoaderData();
  const fetcher = useFetcher();
  return (
    <div>
      <div>{message}</div>
      <fetcher.Form method="post">
        <input type="text" name="name" />
        <button type="submit">submit</button>
      </fetcher.Form>
      <div>{fetcher.data}</div>
    </div>
  );
};

export default Hello;
