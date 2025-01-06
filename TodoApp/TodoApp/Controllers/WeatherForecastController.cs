using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Indicates that access to all actions in this controller requires authentication
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")] // Defines the action associated with the HTTP GET method
        public IActionResult Get()
        {
            var currentUser = HttpContext.User;

            // Retrieve the roles from the "realm_access" claim
            var realmAccessRoles = currentUser.FindFirst("realm_access")?.Value;

            // If the claim is present, parse it to extract the roles
            var roles = realmAccessRoles != null ? GetRolesFromRealmAccess(realmAccessRoles) : [];

            // Check if the "Admin" role is present in the roles
            var isAdmin = roles.Contains("Admin");

            var rng = new Random();
            var forecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            }).ToArray();

            // If the user is an admin, return the weather forecasts; otherwise, return an "Unauthorized" error
            if (isAdmin)
            {
                return Ok(forecasts); // Returns a 200 OK status code with the weather forecasts
            }
            else
            {
                return Unauthorized(); // Returns a 401 Unauthorized status code
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