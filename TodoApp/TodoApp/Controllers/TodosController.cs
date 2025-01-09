using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using TodoApp.Models;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TodosController() : ControllerBase
    {

        private readonly TodoModel[] _todos = [
            new TodoModel() {
                Id = 1,
                UserId = 1,
                Title = "Todo 1",
                Completed = false
            },
            new TodoModel() {
                Id = 2,
                UserId = 2,
                Title = "Todo 2",
                Completed = true
            },
            new TodoModel() {
                Id = 3,
                UserId = 2,
                Title = "Todo 3",
                Completed = false
            },
            new TodoModel() {
                Id = 4,
                UserId = 1,
                Title = "Todo 4",
                Completed = false
            }
        ];

        [HttpGet]
        public IActionResult Get()
        {
            var currentUser = HttpContext.User;

            // Retrieve the roles from the "realm_access" claim
            var realmAccessRoles = currentUser.FindFirst("realm_access")?.Value;

            // If the claim is present, parse it to extract the roles
            var roles = realmAccessRoles != null ? GetRolesFromRealmAccess(realmAccessRoles) : [];

            // Check if the "Admin" role is present in the roles
            var allowed = roles.Contains("development") || roles.Contains("management") || roles.Contains("default-roles-corpauth ");

            var todos = _todos;
      
            if (allowed)
            {
                return Ok(todos); 
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var currentUser = HttpContext.User;

            // Retrieve the roles from the "realm_access" claim
            var realmAccessRoles = currentUser.FindFirst("realm_access")?.Value;

            // If the claim is present, parse it to extract the roles
            var roles = realmAccessRoles != null ? GetRolesFromRealmAccess(realmAccessRoles) : [];

            // Check if the "Admin" role is present in the roles
            var isAdmin = roles.Contains("Admin");

            var todo = _todos.FirstOrDefault(todo => todo.Id == id);

            if (isAdmin)
            {
                return Ok(todo);
            }
            else
            {
                return Unauthorized();
            }
        }

        // Method to extract roles from the "realm_access" claim
        public static IEnumerable<string> GetRolesFromRealmAccess(string realmAccessRoles)
        {
            // Parse the JSON string to extract the roles
            // You can use a JSON parser or a serializer/deserializer for this
            // In this example, we assume the string is a JSON array
            var json = JObject.Parse(realmAccessRoles);
            var rolesArray = json["roles"] as JArray;
            if (rolesArray != null)
            {
                return rolesArray.Select(r => r.ToString());
            }
            return [];
        }
    }
}