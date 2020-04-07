pragma solidity ^0.5.0;


contract SolidityDrive {
    struct File {
        string hash;
        string fileName;
        string fileType;
        string amount;
        uint256 date;
    }

    mapping(address => File[]) files;

    function add(
        string memory _hash,
        string memory _fileName,
        string memory _fileType,
        string memory _amount,
        uint256 _date
    ) public {
        files[msg.sender].push(
            File({
                hash: _hash,
                fileName: _fileName,
                fileType: _fileType,
                amount: _amount,
                date: _date
            })
        );
    }

    function getFile(uint256 _index)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        File memory file = files[msg.sender][_index];
        return (
            file.hash,
            file.fileName,
            file.fileType,
            file.amount,
            file.date
        );
    }

    function getLength() public view returns (uint256) {
        return files[msg.sender].length;
    }

    mapping(address => uint256) public deposits;

    function depositsFund(address[] memory payee) public payable {
        uint256 amount = msg.value;

        for (uint256 i = 0; i < payee.length; i++) {
            deposits[payee[i]] = deposits[payee[i]] + (amount) / payee.length;
        }
    }

    function withdraw(address payable payee) public {
        uint256 payment = deposits[payee];
        deposits[payee] = 0;
        payee.transfer(payment);
    }

    function checkBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
