export default {
   createBreadcrumbs(input) {
      let lastPathElement = "/";
      let breadcrumbs = [{
         label: "Home",
         relativePath: lastPathElement
      }];
      input.relativePath
         .split("/")
         .filter(function(name) {
            return name.trim() !== "";
         })
         .forEach(function(pathElement) {
            let currRelativePath = lastPathElement + pathElement + "/";
            breadcrumbs.push({
               label: pathElement,
               relativePath: currRelativePath
            });
            lastPathElement = currRelativePath;
         });
      return {
         lastPathElement: lastPathElement,
         breadcrumbs: breadcrumbs
      };
   }
};