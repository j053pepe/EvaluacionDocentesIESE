using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace AppDocentes
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configuración y servicios de API web

            // Rutas de API web
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
               name: "WithActionApi",
               routeTemplate: "api/{controller}/{action}/{id}",
               defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "GetMessage",
                routeTemplate: "api/{controller}/{action}/{quoteName}",
                defaults: new { quoteName = RouteParameter.Optional }
            );
        }
    }
}
