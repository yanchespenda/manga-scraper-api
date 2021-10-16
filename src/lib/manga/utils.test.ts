import * as utils from "./utils"
// @ponicode
describe("utils.default.normalizeUrl", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.normalizeUrl("https://api.telegram.org/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.normalizeUrl(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.normalizeUrl("http://www.example.com/route/123?foo=bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.normalizeUrl("https://croplands.org/app/a/confirm?t=")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.normalizeUrl(-0.5)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.normalizeUrl(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.parseUrl", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.parseUrl("https://twitter.com/path?abc")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.parseUrl(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.parseUrl(10.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.parseUrl("http://www.example.com/route/123?foo=bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.parseUrl("https://api.telegram.org/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.parseUrl(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.flatten", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.flatten("foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.flatten("Foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.flatten(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.flatten(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.flatten(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.flatten(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.uniq", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.uniq(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.uniq(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.uniq(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.uniq(["foo bar", -0.353, "**text**", 4653])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.uniq(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.uniq(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.range", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.range(1, ["39.2233", "-78.8613"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.range(-5.48, ["39.2233", "-78.8613"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.range(true, 5)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.range(-5.48, ["-19.3366", "-46.1477"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.range(false, 50)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.range(Infinity, "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.isNumber", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.isNumber(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.isNumber(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.isNumber("elio@example.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.isNumber("Dillenberg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.isNumber(241)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.isNumber(NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.normalizeJson", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.normalizeJson(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.normalizeJson("Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.normalizeJson("Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.normalizeJson(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.normalizeJson(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.normalizeJson(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.stripBBCode", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.stripBBCode("Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.stripBBCode(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.stripBBCode("Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.stripBBCode(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.stripBBCode(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.stripBBCode(NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.extractText", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.extractText("(?P<first_group_name>.*)-(?P=first_group_name)", false, 100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.extractText(100, "Jean-Philippe", 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.extractText(true, "Jean-Philippe", 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.extractText(true, "Michael", 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.extractText(true, "Edmond", 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.extractText(true, -Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.extractJSON", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.extractJSON("(?P<ip>[^%]+)%(?P<route_domain>[0-9]+)", "Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.extractJSON(100, 142)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.extractJSON("^(?P<key>(Product|Build|Sequence|BaseBuild|Edition|Date|Built|Changelist|JobID))\\:(?P<value>.*)", "Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.extractJSON("(.*)-(.+)", "George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.extractJSON("min\\s+\\d+\\s+of", true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.extractJSON("", -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.pathMatch", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.pathMatch(true, "^(?P<key>(Product|Build|Sequence|BaseBuild|Edition|Date|Built|Changelist|JobID))\\:(?P<value>.*)")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.pathMatch(true, "(?P<ip>[^%]+)%(?P<route_domain>[0-9]+)")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.pathMatch(true, "definition-checksum\\s(?P<checksum>\\w+)")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.pathMatch(true, "\\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)\\[")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.pathMatch(-1.0, -100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.pathMatch(-Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.generateId", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.generateId("myDIV", "Configuration", "bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.generateId("bc23a9d531064583ace8f67dad60f6bb", 1, "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.generateId("myDIV", 3, "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.generateId("myDIV", "Interactions", "a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.generateId("myDIV", "Quality", 12)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.generateId(Infinity, "", Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.default.parseId", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.default.parseId(":")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.default.parseId("a:")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.default.parseId("a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.default.parseId("a")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.default.parseId("bc23a9d531064583ace8f67dad60f6bb:bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.default.parseId(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
