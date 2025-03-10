import { Outlet } from "react-router";

function Root() {
  return (
    <>
      <menu className="header">
        <li>link1</li>
        <li>link2</li>
        <li>link3</li>
      </menu>
      <Outlet />
    </>
  );
}

export default Root;
