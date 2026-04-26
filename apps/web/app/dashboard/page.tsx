export default async function page() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const response = await data.json();
  return (
    <div>
      <div>
        <h1>dashboard page</h1>
        <div>{JSON.stringify(response)}</div>
      </div>
    </div>
  );
}
