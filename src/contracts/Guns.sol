pragma solidity ^0.5.0;

contract Guns {
    string public name;
    uint public productCount = 0;
    uint public _sno = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
        uint sno;
        string reason;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,
        uint sno,
        string reason
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,
        uint sno,
        string reason
    );

    constructor() public {
        name = "Gun Control";
    }

    function createProduct(string memory _name, uint _price, string memory _reason) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        require(bytes(_reason).length > 0);
        // Require a valid price
        require(_price > 0);
        // Increment product count
        productCount ++;
        // Create the product
        _sno = 1000000+productCount;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false, _sno, _reason);

        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false, _sno, _reason);
    }

    function purchaseProduct(uint _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.owner;
        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        // Require that the product has not been purchased already
        require(!_product.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        _product.owner = msg.sender;
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true, _sno, _product.reason);
    }
}
