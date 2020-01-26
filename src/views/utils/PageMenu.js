import React from "react";
import { Container, Menu } from "semantic-ui-react";
function PageMenu({ pageCount, callback, currentPage }) {
    const getPages = () => {
        let array = [];
        for (let i = 1; i <= pageCount; i++) array.push(i);
        if (array.indexOf(currentPage) > 5) {
            array.splice(1, array.indexOf(currentPage) - 4);
            array.splice(1, 1, -1);
        }
        if (array.indexOf(currentPage) + 5 <= array.length) {
            array.splice(array.indexOf(currentPage) + 5, array.length - 2 - (array.indexOf(currentPage) + 5) + 1);
            array.splice(-2, 1, -1);
        }
        return array;
    };
    return <Container textAlign="center">
        {
            getPages().find(x => x !== -1) && <Menu pagination>
                {
                    getPages().map(item => <Menu.Item key={item}
                        disabled={item === -1}
                        active={item === currentPage}
                        onClick={item === -1 ? null : () => callback(item)}
                    >
                        {item === -1 ? "..." : item}
                    </Menu.Item>)
                }
            </Menu>
        }
    </Container>
}

export default PageMenu;
