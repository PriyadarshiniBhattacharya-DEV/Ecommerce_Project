import { useEffect, useState } from "react";
import { showUserList, searchUserList } from "../../Services/Api";
function ShowUsersPage(){
    const[users, setUsersList] = useState([]);
    const [search, setSearch] = useState("");

    const loadUsersList = async() =>{
        const usersList = await showUserList();
        setUsersList(usersList);
    }

    useEffect(() => {
        loadUsersList();
    }, []);
    const handleSearch = async() =>{

      if (!search.trim()) {
        loadUsersList();
        return;
      }
      const response = await searchUserList(search);
      if (!response.ok) {
        alert(response.message || "Error searching users");
        return;
      }
      setUsersList(response.data);
    }
    return(
        <>
        <div className="input-group mt-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search User by Id or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleSearch}
        >
          <i className="bi bi-search"></i>
        </button>
        </div>
        <div>
          <table className="table table-success table-striped table-hover">
              <thead>
                  <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone No.</th>
                  <th>Address</th>
              </tr>
              </thead>
              <tbody>
                  {users.map((user)=>(
                      <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                  </tr>
                  ))}
              </tbody>
          </table>
        </div>
        </>
    );
}
export default ShowUsersPage;