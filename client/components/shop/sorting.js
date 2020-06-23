export default () => {
  return (
    <div class="aa-product-catg-head">
      <div class="aa-product-catg-head-left">
        <form action="" class="aa-sort-form">
          <label for="">Sort by</label>
          <select name="">
            <option value="1" selected="Default">Default</option>
            <option value="2">Name</option>
            <option value="3">Price</option>
            <option value="4">Date</option>
          </select>
        </form>
        <form action="" class="aa-show-form">
          <label for="">Show</label>
          <select name="">
            <option value="1" selected="12">12</option>
            <option value="2">24</option>
            <option value="3">36</option>
          </select>
        </form>
      </div>
      <div class="aa-product-catg-head-right">
        <a id="grid-catg" href="#"><span class="fa fa-th"></span></a>
        <a id="list-catg" href="#"><span class="fa fa-list"></span></a>
      </div>
    </div>
  )
}
