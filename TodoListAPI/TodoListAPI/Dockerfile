FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder

WORKDIR /app

COPY . .

RUN dotnet restore

RUN dotnet publish -c Release -o /app/main --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

COPY --from=builder /app/main ./app/main

ENTRYPOINT ["dotnet", "app/main/TodoListAPI.dll"]