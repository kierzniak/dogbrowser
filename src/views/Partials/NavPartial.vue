<template>
  <header>
    <nav>
      <ul class="navbar-nav">
        <RouterLink tag="li" class="nav-item" :to="{ name: 'home' }" active-class="" exact-active-class="active">
          <a class="nav-link">Home</a>
        </RouterLink>
        <RouterLink tag="li" class="nav-item" :to="{ name: 'map' }" active-class="" exact-active-class="active">
          <a class="nav-link">Map</a>
        </RouterLink>
      </ul>
    </nav>
  </header>
</template>

<script>
/**
 * NavPartial component
 *
 * NavPartial component is responsible for displaying navigation part of the website.
 */
export default {
  name: "NavPartial"
};
</script>
