using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add authentication services to the builder
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, o =>
    {
        // Set the metadata address for the OpenID configuration
        o.MetadataAddress = "http://localhost:8080/realms/corpauth/.well-known/openid-configuration";

        // Set the authority for the authentication server
        o.Authority = "http://localhost:8080/realms/corpauth";

        // Set the audience for the JWT token
        o.Audience = "account";

        // For testing, you might want to disable HTTPS metadata requirement
        // Set this to true in production for security
        o.RequireHttpsMetadata = false;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();
//app.UseAuthentication();

app.MapControllers();

await app.RunAsync();
