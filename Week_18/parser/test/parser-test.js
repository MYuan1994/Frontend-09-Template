let assert = require('assert');
import { parserHTML } from '../parser.js';

describe('parser模块测试', function () {

    it('Base function test', function () {
        let tree = parserHTML('<a>张明远</a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 1);
    });

    it('attribute test', function () {
        let tree = parserHTML('<a href="www.baidu.com"></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    
    it('after attributename', function () {
        let tree = parserHTML('<a href ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it('afterAttributeName', function () {
        let tree = parserHTML('<input disabled name="zmy"></input>');
        assert.equal(tree.children[0].children.length, 0);
    });

    it('beforeAttributeName', function () {
        let tree = parserHTML('<div \n id="z"></div>');
        assert.equal(tree.children.length, 1);
    });
    
    it('afterQuotedAttributeValue', function () {
        let tree = parserHTML('<div id="idZ" name/><div id="idZ" name="name"/>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it('singleQuotedAttributeValue', function () {
        let tree = parserHTML("<div id='idZ'/>");
        assert.equal(tree.children.length, 0);
    });

    //抛出error为正确
    it('line 219 unexpected charater', function () {
        let tree = parserHTML("<div id='idZ'n/>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it('tagOpen', function () {
        let tree = parserHTML("<span>< </span>");
        assert.equal(tree.children.length, 1);
    }); 
    
    // it('endTagOpen', function () {
    //     let tree = parserHTML("<div></ ");
    //     assert.equal(tree.children.length, 1);
    //     assert.equal(tree.children[0].children.length, 0);
    // });
    
    
    it('tagName', function () {
        let tree = parserHTML("<div1></div1>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it('selfClosingStartTag EOF', function () {
        let tree = parserHTML('<div/>');
        assert.equal(tree.children.length, 0);
    });
    
    it('UnquotedAttributeValue', function () {
        let tree = parserHTML('<div \n id=zzz />');
        assert.equal(tree.children.length, 0);
    });

    it('UnquotedAttributeValue2', function () {
        let tree = parserHTML('<div title=zzz/>');
        assert.equal(tree.children.length, 0);
    });

    it('beforeAttributeName', function () {
        let tree = parserHTML('<div id=zzz>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    
    
    describe('syntax模块测试', function () {

        //抛出error：Tag start end doesn't match!!!为正确
        it('line 46 endtag与starttag不匹配', function () {
            let tree = parserHTML('<a>张明远</div>');
            assert.equal(tree.children[0].tagName, "a");
            assert.equal(tree.children[0].children.length, 1);
        });
    
        it('line 51 style标签', function () {
            let tree = parserHTML('<style>div{display:flex;width:50px;}</style><div name="www.baidu.com">张明远</div>');
            assert.equal(tree.children.length, 2);
        });

    });

    describe('layout模块测试', function () {


        it('flex', function () {
            let tree = parserHTML('<style>div{display:flex;width:50px;flexWrap:nowrap}</style><div><div>张明远</div></div>');
            assert.equal(tree.children[0].children.length, 1);
        });

        it('auto', function () {
            let tree = parserHTML('<style>div{display:flex;;width:auto;height:auto;}</style><div><span></span></div>');
            assert.equal(tree.children[0].children.length, 1);
        });

        it('mainspace', function () {
            let tree = parserHTML('<style>#parent{display:flex;flexWrap:nowrap} #child{width:60px;height:60px;}</style><div id="parent"><div id="child"></div></div>');
            assert.equal(tree.children[0].children.length, 1);
        });

        it('isAutoMainSize', function () {
            let tree = parserHTML('<style>#fl{display:flex;flexDirection:column;}</style><div id="fl"><div>张明远</div></div>');
            assert.equal(tree.children[0].children.length, 1);
        });

        it('alignSelf', function () {
            let tree = parserHTML('<style>#A{display:flex;width:50px;alignItems:center;height:20px;}#B{alignSelf:center;height:20px;}#C{alignSelf:flex-start;}#D{alignSelf:flex-end;}</style><div id="A"><div id="B"></div><div id="C"></div><div id="D"></div></div>');
            assert.equal(tree.children[0].children.length, 1);
        }); 
        
        it('flexDirection alignContent justifyContent', function () {
            let tree = parserHTML(
                `<style>
                    #A{
                        display:flex;
                        alignContent:flex-start;
                        flexDirection:column-reverse;
                        justifyContent:flex-start;
                    }
                    #B{
                        display:flex;
                        alignContent:flex-end;
                        flexDirection:row-reverse;
                        justifyContent:flex-end;
                    }
                    #C{
                        display:flex;
                        alignContent:space-between;
                        justifyContent:space-between;
                    }
                    #D{
                        display:flex;
                        alignContent:space-around;
                        justifyContent:space-around;
                    }
                    #E{
                        display:flex;
                        alignContent:stretch;
                        flexWrap:wrap-reverse;
                    }
                    #F{
                        display:flex;
                        alignContent:center;
                        justifyContent:center;
                    }
                </style>
                <div id="A"></div>
                <div id="B"></div>
                <div id="C"></div>
                <div id="D"></div>
                <div id="E"></div>
                <div id="F"></div>`);
            assert.equal(tree.children[0].children.length, 1);
        });

        it('line 221 flexTotal', function () {
            let tree = parserHTML(
                `<style>
                    #main{display:flex;width:50px;flexWrap:nowrap;}
                    #a,#b,#c,#d{width:20px;height:10px;flex:5;}
                </style>
                <div id="main">
                    <div id="a"></div>
                    <div id="b"></div>
                    <div id="c"></div>
                    <div id="d"></div>
                </div>`);
            assert.equal(tree.children[0].children.length, 1);
        });

        

    });

    describe('cssRule模块测试', function () {

        it('复合选择器', function () {
            let tree = parserHTML('<style>div #zmy{display:flex;width:50px;} div>#zmy{display:flex;width:50px;}</style><div><div id="zmy">张明远</div></div>');
            assert.equal(tree.children[0].children.length, 1);
        });

        it('类与通配符', function () {
            let tree = parserHTML('<style>.zmy{display:flex;} *{color:#AAA;}</style><div class="zmy">张明远</div>');
            assert.equal(tree.children[0].children.length, 1);
        });

    });

});

